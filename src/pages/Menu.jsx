import { Link } from 'react-router-dom'
import { FLOW } from '../lib/flow'

// Presenter and tester menu. Not linked from the site. Open it at #/menu.
export default function Menu() {
  return (
    <main className="page menu">
      <p className="eyebrow">Presenter menu (not linked from the site)</p>
      <h1>Jump to any screen</h1>
      <ul>
        {FLOW.map((f) => (
          <li key={f.path}>
            <Link to={f.path}>{f.path}</Link> <span className="small">{f.kind}</span>
          </li>
        ))}
        <li>
          <Link to="/debug">/debug</Link> <span className="small">run log</span>
        </li>
      </ul>
    </main>
  )
}
