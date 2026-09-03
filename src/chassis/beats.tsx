import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// An episode can publish its beats (named states) and a way to jump between them.
// The chassis renders them as buttons so a viewer can step the story without knowing the secret handshake.
export interface BeatControls { beats: readonly string[]; index: number; go: (i: number) => void; hint?: string }
const Ctx = createContext<{ ctl: BeatControls | null; setCtl: (c: BeatControls | null) => void }>({ ctl: null, setCtl: () => {} })

export function BeatsProvider({ children }: { children: ReactNode }) {
  const [ctl, setCtl] = useState<BeatControls | null>(null)
  return <Ctx.Provider value={{ ctl, setCtl }}>{children}</Ctx.Provider>
}

export function useRegisterBeats(ctl: BeatControls) {
  const { setCtl } = useContext(Ctx)
  useEffect(() => { setCtl(ctl); return () => setCtl(null) }, [ctl, setCtl])
}

export const useBeats = () => useContext(Ctx).ctl
