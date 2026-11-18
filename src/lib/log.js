// In-memory run log. Nothing is saved to disk, storage or a server. A page reload clears it.
// It exists so the design check (browser persona agents) and the presenter can read what happened.
// Read it in the browser console or from a test harness with window.__btj.get().

let t0 = performance.now()
let startedAt = Date.now()
let events = []
let cueExposure = []
let seenCues = new Set()
const listeners = new Set()

export function now() {
  return Math.round(performance.now() - t0)
}

function notify() {
  listeners.forEach((fn) => fn())
}

export function logEvent(type, data = {}) {
  events.push({ t: now(), ...data, type })
  notify()
}

// A cue counts as "shown" from the first feedback block that names it. Used for the over-knowledge check.
export function exposeCues(scenario, step, cues = []) {
  cues.forEach((cue) => {
    if (seenCues.has(cue)) return
    seenCues.add(cue)
    cueExposure.push({ t: now(), cue, scenario, step })
  })
  if (cues.length) notify()
}

export function getLog() {
  return {
    startedAt: new Date(startedAt).toISOString(),
    userAgent: navigator.userAgent,
    events: events.slice(),
    cueExposure: cueExposure.slice(),
  }
}

export function resetLog() {
  t0 = performance.now()
  startedAt = Date.now()
  events = []
  cueExposure = []
  seenCues = new Set()
  notify()
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function logVersion() {
  return events.length + cueExposure.length
}

window.__btj = { get: getLog, reset: resetLog }
