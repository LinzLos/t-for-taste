import { useEffect, useRef, useState, type ReactNode } from 'react'

// Two modes. Fluid (default): the stage IS the host, the episode lays itself out responsively,
// and the social frame is whatever you resize the window to. Record (?record): a fixed 1080 × 1350
// stage scaled to fit, so a recording from any machine is the same picture.
export const STAGE = { w: 1080, h: 1350 } as const

export function Stage({ children, record }: { children: ReactNode; record?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  // Fluid needs room. Under 900px wide (phones, narrow tablets) the scaled 4:5 stage reads better.
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  useEffect(() => { const mq = window.matchMedia('(min-width: 900px)'); const on = (e: MediaQueryListEvent) => setWide(e.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on) }, [])
  const fluid = !record && wide

  useEffect(() => {
    if (fluid) return
    const el = host.current!
    const fit = () => {
      const cs = getComputedStyle(el)
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const height = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      setScale(Math.max(0.1, Math.min(width / STAGE.w, height / STAGE.h, 1)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fluid])

  if (fluid) {
    return (
      <div className="stage-host stage-host--fluid" ref={host}>
        <div className="stage-box stage-box--fluid">
          <div className="stage stage--fluid">{children}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="stage-host" ref={host}>
      <div className="stage-box" style={{ width: STAGE.w * scale, height: STAGE.h * scale }}>
        <div className="stage" style={{ width: STAGE.w, height: STAGE.h, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  )
}
