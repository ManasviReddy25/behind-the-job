import { Link } from 'react-router-dom'
import { logEvent } from '../lib/log'

// UI text on this page is written for the site. The reporting routes come from v6 (S6, S8, S9).
export default function End() {
  return (
    <main className="page end">
      <p className="eyebrow">Done</p>
      <h1>You finished all 12 scenarios.</h1>
      <p>If you see a real job scam, report it at ReportFraud.ftc.gov and ic3.gov. If you sent money, contact your bank or payment company right away.</p>
      <Link className="btn" to="/" onClick={() => logEvent('restart')}>
        Back to the start
      </Link>
    </main>
  )
}
