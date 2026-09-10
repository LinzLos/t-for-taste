import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// Two modes. Fluid (default): the stage IS the host, the episode lays itself out responsively,
// and the social frame is whatever you resize the window to. Record (?record): a fixed 1080 × 1350
// stage scaled to fit, so a recording from any machine is the same picture.
import { STAGE } from './stage-size'

export function Stage({ children, record, size = STAGE, fluidMin = 1000, height }: { children: ReactNode; record?: boolean; size?: { w: number; h: number }; fluidMin?: number; height?: number }) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  // Fluid needs room. Under 900px wide (phones, narrow tablets) the scaled 4:5 stage reads better.
  const [wide, setWide] = useState(() => window.innerWidth >= fluidMin)
  useEffect(() => {
    const on = () => setWide(document.body.clientWidth >= fluidMin)
    const ro = new ResizeObserver(on); ro.observe(document.body) // fires once on observe
    window.addEventListener('resize', on)
    return () => { ro.disconnect(); window.removeEventListener('resize', on) }
  }, [fluidMin])
  const fluid = !record && wide

  useEffect(() => {
    if (fluid) return
    const el = host.current!
    const fit = () => {
      const cs = getComputedStyle(el)
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const height = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      setScale(Math.max(0.1, Math.min(width / size.w, height / size.h, 1)))
    }
    const ro = new ResizeObserver(fit) // fires once on observe
    ro.observe(el)
    return () => ro.disconnect()
  }, [fluid, size.w, size.h])

  if (fluid) {
    return (
      <div className="stage-host stage-host--fluid" ref={host} style={height ? ({ '--ep-h': `${height}px` } as CSSProperties) : undefined}>
        {/* the aspect only bites when the host has no fixed height (phones): the box keeps the social frame's shape */}
        <div className="stage-box stage-box--fluid" style={{ aspectRatio: `${size.w} / ${size.h}` }}>
          <div className="stage stage--fluid">{children}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="stage-host" ref={host}>
      <div className="stage-box" style={{ width: size.w * scale, height: size.h * scale }}>
        <div className="stage" style={{ width: size.w, height: size.h, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  )
}
