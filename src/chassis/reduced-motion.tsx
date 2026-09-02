import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// One source of truth for "should this move?". Combines the OS preference with
// the chassis toggle, so every episode has its reduced-motion twin for free.
const Ctx = createContext<{ reduced: boolean; toggle: () => void }>({ reduced: false, toggle: () => {} })

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [system, setSystem] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [override, setOverride] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = (e: MediaQueryListEvent) => setSystem(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const reduced = override ?? system
  useEffect(() => { document.documentElement.dataset.reduced = reduced ? 'true' : 'false' }, [reduced])

  return <Ctx.Provider value={{ reduced, toggle: () => setOverride(v => !(v ?? system)) }}>{children}</Ctx.Provider>
}

export const useReducedMotion = () => useContext(Ctx)
