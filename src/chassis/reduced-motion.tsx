import { useEffect, useState, type ReactNode } from 'react'
import { ReducedMotionContext as Ctx } from './reduced-motion-context'


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

