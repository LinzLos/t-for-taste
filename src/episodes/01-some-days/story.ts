// The story, as data. Copy is ELI5 by rule: nothing a person outside the tool would look up.

export type Beat = 'calm' | 'threshold' | 'pressed' | 'review'
export type NodeState = 'soft' | 'trying' | 'set' | 'stuck'

export const RAGE = { presses: 5, windowMs: 1500 } as const

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
  { id: 'lotion', type: 'when', title: 'Lotion', sub: 'spring-lots is saved', x: 40, y: 50,
    state: { calm: 'trying', threshold: 'stuck', pressed: 'stuck', review: 'stuck' },
    pill: { calm: 'connecting · 14s', threshold: 'still trying · 9 min', pressed: 'still trying · 9 min', review: '' } },
  { id: 'summarize', type: 'then · AI', title: 'Summarize', sub: 'Two lines for the team', x: 420, y: 210,
    state: { calm: 'soft', threshold: 'soft', pressed: 'soft', review: 'soft' },
    pill: { calm: 'waiting', threshold: 'waiting', pressed: 'waiting', review: '' } },
  { id: 'tell', type: 'then · send', title: 'Tell Marike', sub: 'Slack · #growers', x: 200, y: 500,
    state: { calm: 'soft', threshold: 'soft', pressed: 'soft', review: 'soft' },
    pill: { calm: 'waiting', threshold: 'waiting', pressed: 'waiting', review: '' } },
  { id: 'reconnect', type: 'try again', title: 'Reconnect', sub: 'Log in to Lotion again', x: 640, y: 510, dashed: true,
    state: { calm: 'soft', threshold: 'soft', pressed: 'soft', review: 'soft' },
    pill: { calm: 'try 2', threshold: 'try 6', pressed: 'try 6', review: '' } },
]

export const NODE_W = 350
export const NODE_H = 190 // approximate; connectors read live bounds

export const EDGES: [string, string, boolean][] = [
  ['lotion', 'summarize', false],
  ['summarize', 'tell', false],
  ['summarize', 'reconnect', true],
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
