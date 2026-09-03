import { useEffect, useRef, useState, type ReactNode } from 'react'

// The 4:5 frame every episode renders into. Logical size is fixed so a
// recording from one machine matches a recording from another; it scales to fit.
// The outer box takes the scaled size in layout; the inner stage is transformed.
export const STAGE = { w: 1080, h: 1350 } as const

export function Stage({ children }: { children: ReactNode; record?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
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
  }, [])

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
