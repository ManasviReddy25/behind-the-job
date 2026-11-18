import { ACTIONS, CLASSIFICATIONS, CLASSIFICATION_FEEDBACK } from '../content/shared'

// Pure helpers: turn an answer into the feedback that is shown, and the cue IDs that feedback names.

export function actionLabel(id) {
  return ACTIONS.find((a) => a.id === id)?.label ?? id
}

export function classificationLabel(id) {
  return CLASSIFICATIONS.find((c) => c.id === id)?.label ?? id
}

export function feedbackFor(scenario, step, answer) {
  if (step.type === 'action') {
    return { text: step.feedback[answer.optionId], cues: step.cues?.[answer.optionId] ?? [] }
  }
  if (step.type === 'classify') {
    return { text: CLASSIFICATION_FEEDBACK[answer.optionId][scenario.kind], cues: [] }
  }
  if (step.type === 'choice') {
    const chosen = step.options.find((o) => o.id === answer.optionId)
    const best = step.options.find((o) => o.best)
    const cues = [...(chosen.cues ?? []), ...(chosen.id === best.id ? [] : best.cues ?? [])]
    return { chosen, best, cues }
  }
  if (step.type === 'chips') {
    const tapped = new Set(answer.tapped)
    const noticed = step.chips.filter((c) => c.kind === 'correct' && tapped.has(c.id))
    const missed = step.chips.filter((c) => c.kind === 'correct' && !tapped.has(c.id))
    const neutral = step.chips.filter((c) => c.kind === 'neutral' && tapped.has(c.id))
    return { noticed, missed, neutral, cues: step.chips.filter((c) => c.kind === 'correct').flatMap((c) => c.cues ?? []) }
  }
  return { cues: [] }
}
