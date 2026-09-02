import { useEffect, useRef, useState, type ReactNode } from 'react'

// The 4:5 frame every episode renders into. Logical size is fixed so a
// recording from one machine matches a recording from another; it scales to fit.
export const STAGE = { w: 1080, h: 1350 } as const

export function Stage({ children, record }: { children: ReactNode; record: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = host.current!
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      setScale(Math.min(width / STAGE.w, height / STAGE.h, record ? Infinity : 1))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [record])

  return (
    <div className="stage-host" ref={host}>
      <div
        className="stage"
        style={{ width: STAGE.w, height: STAGE.h, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
