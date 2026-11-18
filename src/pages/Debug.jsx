import { useSyncExternalStore } from 'react'
import { getLog, logVersion, resetLog, subscribe } from '../lib/log'

// Run log viewer for the design check. Not linked from the site. Open it at #/debug.
// The log lives in memory only. A page reload clears it. Nothing is sent anywhere.
export default function Debug() {
  useSyncExternalStore(subscribe, logVersion)
  const log = getLog()
  return (
    <main className="page debug">
      <p className="eyebrow">Run log (in memory only)</p>
      <h1>{log.events.length} events, {log.cueExposure.length} cues shown</h1>
      <button type="button" className="btn" onClick={resetLog}>
        Reset log
      </button>
      <h2>Cue exposure</h2>
      <pre>{JSON.stringify(log.cueExposure, null, 1)}</pre>
      <h2>Events</h2>
      <pre>{JSON.stringify(log.events, null, 1)}</pre>
    </main>
  )
}
