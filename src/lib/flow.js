import { SCENARIOS } from '../content/scenarios'
import { PART_ORDER, PARTS } from '../content/shared'

// The fixed order of the whole experience: Part 1 (Victim), Part 2 (Scammer tactics), Part 3 (Guardian).
export const FLOW = [
  { path: '/', kind: 'home' },
  { path: '/parts', kind: 'parts' },
  ...PART_ORDER.flatMap((part) => [
    { path: `/part/${part}`, kind: 'intro', part },
    ...SCENARIOS.filter((s) => s.part === part).map((s) => ({ path: `/s/${s.id}`, kind: 'scenario', part, id: s.id })),
  ]),
  { path: '/end', kind: 'end' },
]

export function nextAfter(path) {
  const i = FLOW.findIndex((f) => f.path === path)
  return i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : null
}

export function nextLabel(from, to) {
  if (!to) return 'Finish'
  if (to.kind === 'scenario') {
    const unit = PARTS[to.part].unit
    return from.kind === 'intro' ? 'Start' : `Next ${unit.toLowerCase()}`
  }
  if (to.kind === 'intro') return `Start Part ${PARTS[to.part].number}`
  if (to.kind === 'end') return 'Finish'
  return 'Continue'
}
