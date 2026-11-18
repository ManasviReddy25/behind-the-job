import { useEffect, useMemo, useRef, useState } from 'react'
import { NEUTRAL_CHIP_LINE } from '../content/shared'
import { displayOrder } from '../lib/order'
import { logEvent, now } from '../lib/log'

const LETTERS = 'ABCDEFGH'

function useStepShown(scenarioId, step) {
  const shownAt = useRef(0)
  useEffect(() => {
    shownAt.current = now()
    logEvent('step_shown', { scenario: scenarioId, step: step.key, stepType: step.type })
  }, [scenarioId, step.key, step.type])
  return shownAt
}

// One question with a list of options. Used for the action step, the classification step and the choice steps.
export function ChoiceStep({ scenario, step, options, answer, onAnswer, showBest, children }) {
  const shownAt = useStepShown(scenario.id, step)
  const ordered = useMemo(
    () => (step.type === 'choice' && !step.fixedOrder ? displayOrder(options, `${scenario.id}:${step.key}`) : options),
    [options, scenario.id, step.key, step.type, step.fixedOrder],
  )
  const lettered = step.type === 'choice' && !step.noLetters

  function pick(opt, position) {
    if (answer) return
    onAnswer({ optionId: opt.id, label: opt.label, position, timeOnStepMs: now() - shownAt.current })
  }

  return (
    <section className="step" aria-labelledby={`h-${scenario.id}-${step.key}`} data-scenario={scenario.id} data-step={step.key}>
      <h2 id={`h-${scenario.id}-${step.key}`} className="step-prompt" tabIndex={-1}>
        {step.prompt}
      </h2>
      <div className={`options${step.type === 'classify' ? ' is-scale' : step.type === 'action' ? ' is-actions' : ''}`} role="group" aria-label={step.prompt}>
        {ordered.map((o, i) => {
          const selected = answer?.optionId === o.id
          const isBest = showBest && !!answer && o.best
          return (
            <button
              key={o.id}
              type="button"
              className={`option${selected ? ' is-selected' : ''}${isBest ? ' is-best' : ''}${answer ? ' is-locked' : ''}`}
              aria-pressed={selected}
              aria-disabled={!!answer}
              data-scenario={scenario.id}
              data-step={step.key}
              data-option={o.id}
              data-position={i + 1}
              onClick={() => pick(o, i + 1)}
            >
              {lettered && <span className="opt-letter">{LETTERS[i]}</span>}
              {o.icon && <span className="opt-icon" aria-hidden="true">{o.icon}</span>}
              <span className="opt-main">
                <span className="opt-text">{o.label}</span>
                {(selected || isBest) && (
                  <span className="opt-tags">
                    {selected && <span className="opt-tag">Your choice</span>}
                    {isBest && <span className="opt-tag opt-tag-best">Best answer</span>}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
      {children}
    </section>
  )
}

export function ChoiceFeedback({ fb }) {
  if (fb.text) {
    return (
      <div className="feedback" role="status">
        <p>{fb.text}</p>
      </div>
    )
  }
  const sameAsBest = fb.chosen.id === fb.best.id
  return (
    <div className="feedback" role="status">
      {sameAsBest ? (
        <p>
          <strong>Best answer.</strong> {fb.chosen.note}
        </p>
      ) : (
        <>
          <p>
            <strong>Your choice.</strong> {fb.chosen.note}
          </p>
          <p>
            <strong>Best answer.</strong> {fb.best.note}
          </p>
        </>
      )}
    </div>
  )
}

// "Tap what you notice": tap chips, then press Check.
export function ChipStep({ scenario, step, answer, onCheck }) {
  const shownAt = useStepShown(scenario.id, step)
  const [tapped, setTapped] = useState([])
  const ordered = useMemo(() => displayOrder(step.chips, `${scenario.id}:${step.key}`), [step.chips, scenario.id, step.key])
  const current = answer ? answer.tapped : tapped

  function toggle(chip) {
    if (answer) return
    const on = !tapped.includes(chip.id)
    setTapped(on ? [...tapped, chip.id] : tapped.filter((t) => t !== chip.id))
    logEvent('chip_toggle', { scenario: scenario.id, chip: chip.id, on })
  }

  function check() {
    if (answer) return
    onCheck({ tapped, timeOnStepMs: now() - shownAt.current })
  }

  return (
    <section className="step" aria-labelledby={`h-${scenario.id}-${step.key}`} data-scenario={scenario.id} data-step={step.key}>
      <h2 id={`h-${scenario.id}-${step.key}`} className="step-prompt" tabIndex={-1}>
        {step.prompt}
      </h2>
      <div className="chips" role="group" aria-label={step.prompt}>
        {ordered.map((c, i) => {
          const on = current.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              className={`chip${on ? ' is-on' : ''}${answer ? ' is-locked' : ''}`}
              aria-pressed={on}
              aria-disabled={!!answer}
              data-scenario={scenario.id}
              data-step={step.key}
              data-chip={c.id}
              data-position={i + 1}
              onClick={() => toggle(c)}
            >
              {c.label}
            </button>
          )
        })}
      </div>
      {!answer && (
        <button type="button" className="btn btn-primary" data-action="check" onClick={check}>
          Check
        </button>
      )}
    </section>
  )
}

export function ChipFeedback({ fb }) {
  return (
    <div className="feedback" role="status">
      {fb.noticed.length > 0 && (
        <div className="fb-group fb-noticed">
          <h3>You noticed</h3>
          <ul>
            {fb.noticed.map((c) => (
              <li key={c.id}>
                <strong>{c.label}.</strong> {c.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
      {fb.missed.length > 0 && (
        <div className="fb-group fb-missed">
          <h3>You missed</h3>
          <ul>
            {fb.missed.map((c) => (
              <li key={c.id}>
                <strong>{c.label}.</strong> {c.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
      {fb.neutral.length > 0 && (
        <div className="fb-group fb-neutral">
          <h3>Not a sign on its own</h3>
          <p>{NEUTRAL_CHIP_LINE}</p>
          <ul>
            {fb.neutral.map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
