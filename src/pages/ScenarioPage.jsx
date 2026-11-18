import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MessageView from '../components/MessageView'
import { PauseButton, PlanBox, Stamp, TakeawayModal } from '../components/Extras'
import { ChipFeedback, ChipStep, ChoiceFeedback, ChoiceStep } from '../components/Steps'
import { ACTIONS, CLASSIFICATIONS, PARTS } from '../content/shared'
import { byId, byPart } from '../content/scenarios'
import { feedbackFor } from '../lib/feedback'
import { FLOW, nextAfter, nextLabel } from '../lib/flow'
import { exposeCues, logEvent, now } from '../lib/log'

export default function ScenarioPage() {
  const { id } = useParams()
  const scenario = byId[id]
  if (!scenario) {
    return (
      <main className="page">
        <h1>Page not found</h1>
        <Link to="/">Back to the start</Link>
      </main>
    )
  }
  return <ScenarioFlow key={id} scenario={scenario} />
}

function optionsFor(step) {
  if (step.type === 'action') return ACTIONS
  if (step.type === 'classify') return CLASSIFICATIONS
  if (step.type === 'chips') return []
  return step.options.map((o) => ({ id: o.id, label: o.text, best: o.best }))
}

const OPEN_LABEL = { victim: 'Open the message', offender: 'Look at the case', guardian: 'See what they sent' }

function ScenarioFlow({ scenario }) {
  const navigate = useNavigate()
  const part = PARTS[scenario.part]
  const steps = scenario.steps
  const total = byPart(scenario.part).length
  const [opened, setOpened] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const [answers, setAnswers] = useState({})
  const [visible, setVisible] = useState(1) // how many steps are on screen
  const feedbackAt = useRef({})
  const bottomRef = useRef(null)
  const showTitleNow = scenario.part === 'offender' // Victim and Guardian titles would give the answer away

  const path = `/s/${scenario.id}`
  const here = FLOW.find((f) => f.path === path)
  const upcoming = nextAfter(path)

  useEffect(() => {
    logEvent('scenario_start', { scenario: scenario.id, part: scenario.part, kind: scenario.kind ?? null, caseId: scenario.caseId })
    window.scrollTo(0, 0)
  }, [scenario.id, scenario.part, scenario.kind, scenario.caseId])

  const isLastInPart = scenario.index === total
  const allDone = steps.every((s) => answers[s.key])

  function record(step, answer, extra = {}) {
    setAnswers((prev) => ({ ...prev, [step.key]: answer }))
    const fb = feedbackFor(scenario, step, answer)
    feedbackAt.current[step.key] = now()
    logEvent('answer', { scenario: scenario.id, step: step.key, stepType: step.type, ...extra, ...answer })
    logEvent('feedback_shown', { scenario: scenario.id, step: step.key, cues: fb.cues })
    exposeCues(scenario.id, step.key, fb.cues)
    const isLast = steps[steps.length - 1].key === step.key
    if (isLast) {
      const cues = [...(scenario.takeawayCues ?? []), ...(scenario.plan?.cues ?? [])]
      logEvent('wrapup_shown', { scenario: scenario.id, cues })
      exposeCues(scenario.id, 'wrapup', cues)
    }
  }

  function openMessage() {
    logEvent('message_opened', { scenario: scenario.id })
    setOpened(true)
  }

  function openTakeaway() {
    logEvent('takeaway_opened', { scenario: scenario.id })
    setModalOpen(true)
    setSeen(true)
  }

  function closeTakeaway() {
    logEvent('takeaway_closed', { scenario: scenario.id })
    setModalOpen(false)
  }

  function continueFrom(step, index) {
    logEvent('continue_clicked', { scenario: scenario.id, step: step.key, feedbackDwellMs: now() - feedbackAt.current[step.key] })
    setVisible(index + 2)
  }

  function goNext() {
    const last = steps[steps.length - 1]
    logEvent('next_clicked', { scenario: scenario.id, feedbackDwellMs: now() - feedbackAt.current[last.key], to: upcoming?.path ?? null })
    navigate(upcoming ? upcoming.path : '/end')
  }

  // Move focus to the newest step so keyboard and screen reader users land on it.
  useEffect(() => {
    if (visible > 1) {
      const el = document.querySelector(`[data-scenario="${scenario.id}"][data-step="${steps[visible - 1].key}"] h2`)
      el?.focus({ preventScroll: true })
      el?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [visible, scenario.id, steps])

  useEffect(() => {
    if (allDone) bottomRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [allDone])

  const stepOptions = useMemo(() => steps.map(optionsFor), [steps])

  return (
    <main className="scenario-wrap" data-scenario-page={scenario.id}>
      <div className="scenario-bar">
        <span className="part-pill">
          <i /> Part {part.number}: {part.name}
        </span>
        <span className="stage">
          {part.unit} {scenario.index} of {total}
        </span>
        <span className="dots" aria-hidden="true">
          {Array.from({ length: total }, (_, k) => (
            <i key={k} className={k + 1 < scenario.index ? 'done' : k + 1 === scenario.index ? 'now' : ''} />
          ))}
        </span>
      </div>
      <div className="page scenario">
      <header className="scenario-head">
        {showTitleNow && (
          <h1>
            {scenario.title} <span className="stage">({scenario.channel})</span>
          </h1>
        )}
      </header>

      <section className="story-card fade-up" aria-label="The story" style={{ '--who': scenario.story.color }}>
        <div className="story-avatar" aria-hidden="true">
          {scenario.story.avatar}
        </div>
        <div className="story-main">
          <h2 className="story-name">{scenario.story.name}</h2>
          <ul className="story-facts">
            {scenario.story.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="story-text">{scenario.story.text}</p>
          {!opened && (
            <button type="button" className="btn btn-part btn-open" data-action="open-message" onClick={openMessage}>
              {OPEN_LABEL[scenario.part]}
            </button>
          )}
        </div>
      </section>

      {opened && (
        <div className="arrive">
          <p className="context">{scenario.context}</p>
          <MessageView message={scenario.message} />
          {scenario.pause && <PauseButton scenarioId={scenario.id} />}
        </div>
      )}

      {opened && steps.slice(0, visible).map((step, index) => {
        const answer = answers[step.key]
        const fb = answer ? feedbackFor(scenario, step, answer) : null
        const isLast = index === steps.length - 1
        if (step.type === 'chips') {
          return (
            <div key={step.key}>
              <ChipStep scenario={scenario} step={step} answer={answer} onCheck={(a) => record(step, a)} />
              {fb && <ChipFeedback fb={fb} />}
              {fb && !isLast && visible === index + 1 && <ContinueButton onClick={() => continueFrom(step, index)} />}
            </div>
          )
        }
        return (
          <div key={step.key}>
            <ChoiceStep
              scenario={scenario}
              step={step}
              options={stepOptions[index]}
              answer={answer}
              showBest={step.type === 'choice'}
              onAnswer={(a) => record(step, a)}
            />
            {fb && <ChoiceFeedback fb={fb} />}
            {fb && !isLast && visible === index + 1 && <ContinueButton onClick={() => continueFrom(step, index)} />}
          </div>
        )
      })}

      {allDone && (
        <div className="wrapup-bar fade-up" ref={bottomRef}>
          <button type="button" className="btn btn-primary" data-action="show-takeaway" onClick={openTakeaway}>
            {seen ? 'Show the takeaway again' : 'See the takeaway'}
          </button>
          {seen && !modalOpen && (
            <button type="button" className="btn btn-part" data-action="next" onClick={goNext}>
              {nextLabel(here, upcoming)}
            </button>
          )}
        </div>
      )}
      {allDone && modalOpen && (
        <TakeawayModal onClose={closeTakeaway} label={scenario.title}>
          <div className="wrapup" aria-label="Summary">
            <Stamp scenario={scenario} />
            {scenario.technique && <p className="technique">{scenario.technique}</p>}
            <div className="takeaway">
              <h3>Takeaway</h3>
              <p>{scenario.takeaway}</p>
            </div>
            {scenario.plan && <PlanBox plan={scenario.plan} />}
            {scenario.rule && (
              <div className="rule">
                <h3>Rule to remember</h3>
                <p>{scenario.rule}</p>
                <p className="connects">
                  <strong>Connects to:</strong> {scenario.connects}
                </p>
              </div>
            )}
            {isLastInPart && <p className="part-end">{part.end}</p>}
            <button type="button" className="btn btn-primary btn-next" data-action="next" onClick={goNext}>
              {nextLabel(here, upcoming)}
            </button>
            <button type="button" className="btn btn-ghost" data-action="close-takeaway" onClick={closeTakeaway}>
              Look at the message again
            </button>
          </div>
        </TakeawayModal>
      )}
      </div>
    </main>
  )
}

function ContinueButton({ onClick }) {
  return (
    <button type="button" className="btn btn-primary" data-action="continue" onClick={onClick}>
      Continue
    </button>
  )
}
