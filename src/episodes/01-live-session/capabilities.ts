// The chips are drawn from what is actually connected, so what is not offered is information.
// 'yours' is a phrase the user typed that nothing connected can do. It is a request, not a
// capability, and it never pretends otherwise.
export interface Capability { id: string; label: string; kind: 'when' | 'then' | 'only' | 'yours' }

export const CAPABILITIES: Capability[] = [
  { id: 'page-saved', label: 'When a page is saved', kind: 'when' },
  { id: 'slack-post', label: 'When someone posts in #growers', kind: 'when' },
  { id: 'weekday-9', label: 'Every weekday at 9am', kind: 'when' },
  { id: 'summarize', label: 'Summarize it', kind: 'then' },
  { id: 'translate', label: 'Translate it', kind: 'then' },
  { id: 'post-slack', label: 'Post to Slack', kind: 'then' },
  { id: 'email', label: 'Send an email', kind: 'then' },
  { id: 'add-page', label: 'Add to a Lotion page', kind: 'then' },
  { id: 'mentions', label: 'Only if it mentions pricing', kind: 'only' },
]

// Substring, not fuzzy. Fuzzy is unpredictable on camera.
export const match = (q: string, extra: Capability[] = []) => {
  const all = [...CAPABILITIES, ...extra]
  const t = q.trim().toLowerCase()
  if (!t) return all
  return all.filter(c => c.label.toLowerCase().includes(t))
}

// The scripted run, for recording and for the transport's play button.
// The last line is the punchline: the one thing it cannot do is the thing the series is named after.
export const SCRIPT = [
  { type: 'when a page', pick: 'page-saved' },
  { type: 'summ', pick: 'summarize' },
  { type: 'curate it to my taste', pick: null },
] as const

export const asYours = (label: string): Capability => ({
  id: 'yours-' + label.toLowerCase().replace(/\W+/g, '-'),
  label,
  kind: 'yours',
})

// What can apply right now. A workflow has one trigger, and a filter has nothing to guard
// until there is a step in front of it. Chips that cannot apply are not offered, which is the
// same rule as connection: what is missing from the row is information.
export const applicable = (all: Capability[], tokens: Capability[]) => {
  const hasWhen = tokens.some(t => t.kind === 'when')
  const lastIsStep = tokens.length > 0 && tokens[tokens.length - 1].kind !== 'only'
  return all.filter(c => {
    if (c.kind === 'when') return !hasWhen
    if (c.kind === 'only') return lastIsStep
    return true
  })
}
