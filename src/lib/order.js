// Display order for options and chips.
// v6 lists the best answer first. The site must not do that.
// 'fixed'  = a seeded shuffle. Every visit and every agent run sees the same order (comparable runs, and the
//            "same option position" flag F14 means something).
// 'random' = a new shuffle on every load.
// 'listed' = v6 order (for testing only).
export const SHUFFLE_MODE = 'fixed'

// Tune a scenario's order by changing its salt. Checked by scripts/check-order.mjs.
export const ORDER_SALT = {}

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function displayOrder(items, key) {
  if (SHUFFLE_MODE === 'listed') return items.slice()
  const rnd = SHUFFLE_MODE === 'random' ? Math.random : mulberry32(hash(key) + (ORDER_SALT[key] || 0))
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
