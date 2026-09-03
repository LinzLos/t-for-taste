import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { episodes } from './episodes'
import { useReducedMotion } from './chassis/reduced-motion'

// The period rolls out of the e. Two ideas: a GATE (an overflow-hidden window that starts at the
// e's right edge, so nothing shows until the ball crosses it) and a real ROLL (an off-centre highlight
// in the fill, rotated by distance / radius, so the turn is visible). No scale change: a ball doesn't grow.
function RollingDot() {
  const { reduced } = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [origin, setOrigin] = useState<string>()
  const [travel, setTravel] = useState({ start: -1.05, over: 0.14 })

  // Find the glyph's ink centre so it spins on its own axis. Baseline from font metrics:
  // inside an inline-block with line-height L, baseline = half-leading + ascent.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const cs = getComputedStyle(el)
    const fs = parseFloat(cs.fontSize), L = parseFloat(cs.lineHeight)
    const c = document.createElement('canvas').getContext('2d')!
    c.font = `700 ${fs}px Literata, Georgia, serif`
    const m = c.measureText('.')
    const A = m.fontBoundingBoxAscent ?? fs * 0.9, D = m.fontBoundingBoxDescent ?? fs * 0.25
    const base = (L - (A + D)) / 2 + A
    const r = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 2
    const cx = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2
    setOrigin(`${cx}px ${base - r}px`)
    const rem = r / fs
    setTravel({ start: -1.05, over: 0.14, ...({ turnOut: ((1.05 + 0.14) / rem) * (180 / Math.PI), turnBack: (0.14 / rem) * (180 / Math.PI) } as object) })
  }, [])

  const t = travel as { start: number; over: number; turnOut?: number; turnBack?: number }
  const out = t.turnOut ?? 720, back = t.turnBack ?? 85

  if (reduced) return <span className="gate"><span className="dot dot--still">.</span></span>
  return (
    <span className="gate">
      <motion.span
        ref={ref}
        className="dot"
        style={{ transformOrigin: origin }}
        initial={{ x: `${t.start}em`, rotate: 0 }}
        animate={origin ? { x: [`${t.start}em`, `${t.over}em`, '0em'], rotate: [0, out, out - back] } : undefined}
        transition={{ delay: 0.6, duration: 1.4, times: [0, 0.72, 1], ease: [[0.4, 0, 0.2, 1], [0.33, 1, 0.68, 1]] }}
      >
        .
      </motion.span>
    </span>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Index() {
  const rows = episodes.slice().reverse()
  return (
    <main className="index">
      <div className="title-clip"><h1>T for<br />Taste<RollingDot /></h1></div>
      <p className="lede">I build AI products. Here's what I'm exploring: React and TypeScript patterns, each with a twist.</p>
      <ol className="episode-list">
        {rows.map(({ meta }) => (
          <li key={meta.slug} data-status={meta.status}>
            <Link to={`/${pad(meta.number)}`}>
              <span className="num">T/{pad(meta.number)}</span>
              <span className="name">{meta.title}</span>
              <span className="mat">{meta.material}</span>
              {meta.status === 'draft' && <span className="draft">draft</span>}
            </Link>
          </li>
        ))}
      </ol>
      <p className="sign">Ship fast, laugh last.</p>
    </main>
  )
}
