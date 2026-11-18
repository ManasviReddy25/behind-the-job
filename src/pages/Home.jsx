import { Link } from 'react-router-dom'
import { HOME_CARDS } from '../content/shared'

// Set to false to remove the blurred message cards behind the title.
const SHOW_BACKGROUND_CARDS = true

// 3 x 3 grid of positions. The middle slot stays empty because the title sits there.
const SLOTS = [
  { left: '3%', top: '6%' },
  { left: '36%', top: '3%' },
  { left: '69%', top: '8%' },
  { left: '1%', top: '38%' },
  { left: '71%', top: '40%' },
  { left: '4%', top: '70%' },
  { left: '36%', top: '76%' },
  { left: '68%', top: '70%' },
]

// UI text on this page is written for the site. Card text is from the v6 messages.
export default function Home() {
  return (
    <main className="home">
      {SHOW_BACKGROUND_CARDS && (
        <div className="home-bg" aria-hidden="true">
          {HOME_CARDS.map((c, i) => (
            <div key={i} className="home-card" style={{ ...SLOTS[i], animationDelay: `${i * 0.7}s` }}>
              <span className={`tag tag-${c.tag}`}>{c.tag}</span>
              <div className="hc-from">{c.from}</div>
              <div className="hc-subject">{c.subject}</div>
              <div className="hc-body">{c.body}</div>
            </div>
          ))}
        </div>
      )}
      <div className="home-overlay" aria-hidden="true" />
      <div className="home-main fade-up">
        <span className="pill">
          <span className="pill-dot" /> Interactive awareness tool
        </span>
        <h1 className="home-title">
          BEHIND
          <br />
          THE <span className="job">JOB</span>
        </h1>
        <div className="rule-line" aria-hidden="true">
          <i />
          <span>⚠</span>
          <i />
        </div>
        <p className="home-sub">
          A Multi-Perspective, Scenario-Based Web Application for Employment-Scam Awareness Among Young Adults
        </p>
        <Link className="cta" to="/parts" data-action="start">
          CLICK HERE TO GET STARTED →
        </Link>
      </div>
      <div className="home-label">Employment scam awareness</div>
    </main>
  )
}
