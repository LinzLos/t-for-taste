// The chips are drawn from what is actually connected, so what is not offered is information.
// 'yours' is a phrase the user typed that nothing connected can do. It is a request, not a
// capability, and it never pretends otherwise.
// `heard` is a request made by voice in a build that does not transcribe: it holds no words and says so.
export interface Capability { id: string; label: string; kind: 'when' | 'then' | 'only' | 'yours' | 'heard' }
export const heard = (n: number): Capability => ({ id: `heard-${n}`, label: 'your request', kind: 'heard' })

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

// Whitespace is normalised first, so "curate  it" and "curate it" are one request, not two labels for one id.
export const asYours = (raw: string): Capability => {
  const label = raw.trim().replace(/\s+/g, ' ')
  return { id: 'yours-' + label.toLowerCase().replace(/\W+/g, '-'), label, kind: 'yours' }
}

// Kept for reference, unused: filtering the row by sequence rules made it unstable and unreadable.
// Absence in the row means "not connected". Sequence is the canvas's job, because it can show
// structure rather than only remove things.

// A request has to look like words before it becomes a pill, or the pill means nothing. The check is
// small on purpose and explainable in one sentence: real words have vowels, and a keyboard mash does not.
// Tags (#growers), handles (@marike) and numbers pass on their own.
export const looksLikeWords = (raw: string) => {
  const words = raw.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return false
  const ok = (w: string) => /^[#@]\w+$/.test(w) || /^\d+([.:]\d+)?%?$/.test(w) || (/[aeiouy]/i.test(w) && !/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w))
  return words.every(ok) && words.join('').replace(/[^a-z]/gi, '').length >= 3
}
