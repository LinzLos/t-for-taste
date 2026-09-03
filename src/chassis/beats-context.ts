import { createContext } from 'react'

// An episode can publish its beats (named states) and a way to jump between them.
// The chassis renders them as buttons so a viewer can step the story without knowing the secret handshake.
export interface BeatControls { beats: readonly string[]; index: number; go: (i: number) => void; hint?: string; play?: () => void; playing?: boolean }
export const BeatsContext = createContext<{ ctl: BeatControls | null; setCtl: (c: BeatControls | null) => void }>({ ctl: null, setCtl: () => {} })
