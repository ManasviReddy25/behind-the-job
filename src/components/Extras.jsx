import { useEffect, useRef, useState } from 'react'
import { PAUSE_PROMPT } from '../content/shared'
import { logEvent } from '../lib/log'

// The Pause button on V4 and O4. It changes nothing in the app. It is a prompt.
export function PauseButton({ scenarioId }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pause">
      <button
        type="button"
        className="btn btn-pause"
        aria-expanded={open}
        data-action="pause"
        onClick={() => {
          if (!open) logEvent('pause_opened', { scenario: scenarioId })
          setOpen(true)
        }}
      >
        Pause: take a minute before you answer
      </button>
      {open && (
        <p className="pause-text" role="status">
          {PAUSE_PROMPT}
        </p>
      )}
    </div>
  )
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// The Scammer's plan box shown after question 2 in each Scammer tactics scenario.
export function PlanBox({ plan }) {
  return (
    <aside className="plan" aria-label="Scammer's plan">
      <h3>Scammer's plan</h3>
      <dl>
        <dt>Goal</dt>
        <dd>{cap(plan.goal)}</dd>
        <dt>Tactic</dt>
        <dd>{cap(plan.tactic)}</dd>
        <dt>{plan.why.label}</dt>
        <dd>{cap(plan.why.text)}</dd>
        <dt>Lever</dt>
        <dd>{cap(plan.lever)}</dd>
        <dt>{plan.pushback.label}</dt>
        <dd>{cap(plan.pushback.text)}</dd>
      </dl>
    </aside>
  )
}

// The red or green stamp that lands when the takeaway opens.
export function Stamp({ scenario }) {
  const kind = scenario.part === 'offender' ? 'playbook' : scenario.kind
  const word = kind === 'scam' ? 'SCAM' : kind === 'legit' ? 'REAL' : 'THE PLAYBOOK'
  return (
    <div className={`stamp stamp-${kind}`} role="img" aria-label={word}>
      {word}
    </div>
  )
}

// A pop-up that holds the takeaway. Esc closes it. Focus moves into it and back.
export function TakeawayModal({ onClose, label, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    ref.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [onClose])
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={`Takeaway: ${label}`} tabIndex={-1} ref={ref}>
        <button type="button" className="modal-x" aria-label="Close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}