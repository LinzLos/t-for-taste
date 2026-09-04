// The chips are drawn from what is actually connected, so what is not offered is information.
export interface Capability { id: string; label: string; kind: 'when' | 'then' | 'only' }

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
export const match = (q: string) => {
  const t = q.trim().toLowerCase()
  if (!t) return CAPABILITIES
  return CAPABILITIES.filter(c => c.label.toLowerCase().includes(t))
}

// The scripted run, for recording and for the transport's play button.
// The last line is the punchline: the one thing it cannot do is the thing the series is named after.
export const SCRIPT = [
  { type: 'when a page', pick: 'page-saved' },
  { type: 'summ', pick: 'summarize' },
  { type: 'curate it to my taste', pick: null },
] as const
