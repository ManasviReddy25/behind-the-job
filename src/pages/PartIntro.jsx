import { Link, useParams } from 'react-router-dom'
import { PARTS } from '../content/shared'
import { byPart } from '../content/scenarios'
import { nextAfter } from '../lib/flow'
import { logEvent } from '../lib/log'

export default function PartIntro() {
  const { part } = useParams()
  const p = PARTS[part]
  if (!p) return <main className="page"><h1>Page not found</h1><Link to="/">Back to the start</Link></main>
  const first = nextAfter(`/part/${part}`)
  const count = byPart(part).length
  return (
    <main className="page intro" data-part={part}>
      <span className="pill">
        <span className="pill-dot" /> Part {p.number} of 3
      </span>
      <h1>
        {p.name}. <span className="subtitle">"{p.title}"</span>
      </h1>
      <ul className="cast" aria-label="Who you will meet">
        {byPart(part).map((sc) => (
          <li key={sc.id} style={{ '--who': sc.story.color }}>
            <span className="cast-face" aria-hidden="true">
              {sc.story.avatar}
            </span>
            <span className="cast-name">{part === 'offender' ? sc.story.name.replace(/^Case file \d: /, '') : sc.story.name}</span>
          </li>
        ))}
      </ul>
      <ul className="points">
        {p.points.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <p className="small">{count} {p.unit.toLowerCase()}s in this part.</p>
      <Link className="btn btn-part" to={first.path} data-action="start-part" onClick={() => logEvent('part_started', { part })}>
        Start
      </Link>
    </main>
  )
}
