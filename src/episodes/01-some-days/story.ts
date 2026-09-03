// The story, as data. Copy is ELI5 by rule: nothing a person outside the tool would look up.

export type Beat = 'calm' | 'threshold' | 'pressed' | 'review'
export type NodeState = 'soft' | 'trying' | 'set' | 'stuck'

export const RAGE = { presses: 5, windowMs: 1500 } as const

// Dragging cards is built but parked until the fundamentals are nailed. Flip to true to try it.
export const DRAG_ENABLED = false

export interface NodeSpec {
  id: string
  type: string
  title: string
  sub: string
  x: number
  y: number
  dashed?: boolean
  state: Record<Beat, NodeState>
  pill: Record<Beat, string>
}

// Positions are inside the canvas (1008 × 800), matching the Figma frames.
export const NODES: NodeSpec[] = [
  { id: 'lotion', type: 'when', title: 'Lotion', sub: 'spring-lots is saved', x: 60, y: 60,
    state: { calm: 'trying', threshold: 'stuck', pressed: 'stuck', review: 'stuck' },
    pill: { calm: 'connecting · 14s', threshold: 'still trying · 9 min', pressed: 'still trying · 9 min', review: '' } },
  { id: 'summarize', type: 'then · AI', title: 'Summarize', sub: 'Two lines for the team', x: 580, y: 230,
    state: { calm: 'soft', threshold: 'soft', pressed: 'soft', review: 'soft' },
    pill: { calm: 'waiting', threshold: 'waiting', pressed: 'waiting', review: '' } },
  { id: 'reconnect', type: 'try again', title: 'Reconnect', sub: 'Log in to Lotion again', x: 300, y: 500, dashed: true,
    state: { calm: 'soft', threshold: 'soft', pressed: 'soft', review: 'soft' },
    pill: { calm: 'try 2', threshold: 'try 6', pressed: 'try 6', review: '' } },
]

export const NODE_W = 350
export const NODE_H = 190 // approximate; connectors read live bounds

export const EDGES: [string, string, boolean][] = [
  ['lotion', 'summarize', false],
  ['lotion', 'reconnect', true],
]

export interface Line { who: 'user' | 'sys'; text: string; hot?: boolean }

export const LOG: Record<'calm' | 'threshold', Line[]> = {
  calm: [
    { who: 'user', text: 'connect Lotion and grab the spring-lots page' },
    { who: 'sys', text: 'Connected to Lotion. Can read pages. Found 0.' },
    { who: 'user', text: "it's in TulipTech, under Sales" },
    { who: 'sys', text: 'Still 0. Listening at the TulipTech level.' },
  ],
  threshold: [
    { who: 'user', text: 'I CAN SEE IT RIGHT THERE' },
    { who: 'sys', text: 'Reconnected, try 6. Can now see everything you can. Found 0.' },
    { who: 'user', text: 'IT IS A PUBLIC PAGE', hot: true },
  ],
}

// A clock that tells the truth. Starts at 14s so the first frame matches the frames; counts while calm.
// The jump to "9 min" at the threshold is a jump cut. Keep trying never resets it.
export const CLOCK_START = 14
export const fmtClock = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60}s` : ''}`)

// What the system says after each Reconnect tap. The loop she is clicking against, made visible.
export const ATTEMPT = (n: number) => `Reconnected, try ${n}. Found 0.`

// The offer. The system speaks in the log, the way it has all along. An option, not a scream.
export const OFFER = {
  title: 'Had enough?',
  body: 'Six tries, same answer. Want the rundown of what actually happened while you clicked?',
  primary: 'Fuck this, show me',
  secondary: 'Keep trying',
}

// The composer's placeholder follows the state. The system's quietest line, and it should know what is going on.
export function placeholderFor(beat: Beat, tries: number): string {
  if (beat === 'threshold' || beat === 'pressed') return 'Reconnecting has not changed the answer'
  if (tries >= 4) return 'Try a different page, or tell it where to look'
  if (tries >= 3) return 'Still 0. Where should it look?'
  return 'Describe a change'
}

export const CHIP: Record<Beat, string> = { calm: 'connecting…', threshold: 'still connecting…', pressed: 'still connecting…', review: 'reviewing' }

export const REVIEW = {
  title: 'What it did while you clicked',
  summary: '6 tries · 3 yeses · 1 page moved · nothing ran',
  findings: [
    { n: 1, hot: true, title: 'It moved your page', detail: "Now your team can't edit it. This one won't undo.", action: 'Put it back' },
    { n: 2, hot: true, title: 'It kept asking for more', detail: 'Read, then edit, then everything. You said yes six times.', action: 'Back to read' },
    { n: 3, hot: false, title: "It's logged into the wrong place", detail: "Your personal space, not TulipTech's.", action: 'Switch' },
    { n: 4, hot: false, title: 'It was never listening', detail: "The trigger sat where it can't hear. So nothing ran.", action: 'Listen to Sales' },
  ],
  question: 'Not the day for this?',
  secondary: 'Disconnect Lotion',
  primary: 'Fix all four',
}
