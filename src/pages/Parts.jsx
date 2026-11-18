import { Link } from 'react-router-dom'
import { PART_CARDS, PARTS, PARTS_PAGE, PART_ORDER } from '../content/shared'

// The three parts, in the fixed order. Only Part 1 can be opened from here.
// Parts 2 and 3 open when the learner reaches them, so the order never changes.
export default function Parts() {
  return (
    <main className="page parts-page">
      <header className="parts-head fade-up">
        <span className="pill">
          <span className="pill-dot" /> {PARTS_PAGE.tag}
        </span>
        <h1>
          {PARTS_PAGE.title[0]} <em>{PARTS_PAGE.title[1]}</em>
        </h1>
        <p>{PARTS_PAGE.sub}</p>
      </header>
      <div className="cards-row">
        {PART_ORDER.map((id, i) => {
          const p = PARTS[id]
          const c = PART_CARDS[id]
          const open = i === 0
          const inner = (
            <>
              <span className="part-tag">PART {p.number}</span>
              <span className="emoji-wrap" aria-hidden="true">
                {c.emoji}
              </span>
              <h2>{p.name.toUpperCase()}</h2>
              <p className="part-hint">{c.hint}</p>
              <div className="part-reveal">
                <ul className="part-list">
                  {c.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
              <span className={`part-cta ${open ? '' : 'is-locked'}`}>{open ? 'Start Part 1 →' : 'Opens after the part before it'}</span>
              <span className="part-line" />
            </>
          )
          return open ? (
            <Link
              key={id}
              to={`/part/${id}`}
              className="part-card is-link"
              data-part={id}
              data-action="start-part-card"
            >
              {inner}
            </Link>
          ) : (
            <div key={id} className="part-card" data-part={id} aria-disabled="true">
              {inner}
            </div>
          )
        })}
      </div>
    </main>
  )
}
