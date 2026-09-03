import { useState, type ReactNode } from 'react'
import { BeatsContext, type BeatControls } from './beats-context'

export function BeatsProvider({ children }: { children: ReactNode }) {
  const [ctl, setCtl] = useState<BeatControls | null>(null)
  return <BeatsContext.Provider value={{ ctl, setCtl }}>{children}</BeatsContext.Provider>
}
