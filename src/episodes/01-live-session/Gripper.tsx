import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { EASE } from './motion'

// One SVG, one viewBox, so it is the same drawing at 56px on a desktop and 44px on a phone.
// The grid is rigid and stays a grid; all the organic quality goes to the mouth, which is a
// single quadratic — only the pull point moves between the flat bar and the smile.
export type GripperMode = 'rest' | 'open' | 'typing' | 'listening'
export interface GripperHandle { setLevels: (levels: readonly number[]) => void }

const ROWS = [11, 19, 27] // top, mid, bottom
const COLS = 9
const GRIP_X = [11, 19, 27] // the 3×3 at rest: 8px pitch
const METER_X = (c: number) => 11 + c * 12 // the 9×3 while listening: 12px pitch, full plate
const restX = (c: number) => GRIP_X[Math.min(c, 2)] // extra columns wait, hidden, on the third
const FLAT = 'M 14 50 Q 59.5 50 105 50'
const SMILE = 'M 20 45 Q 59.5 67 99 45'
const PEAK_HOLD = 450, PEAK_FALL = 120 // ms: how long a peak sits, then how fast it falls per row

export const Gripper = forwardRef<GripperHandle, { mode: GripperMode; denied?: boolean }>(
  function Gripper({ mode, denied }, ref) {
    const { reduced } = useReducedMotion()
    const dots = useRef<(SVGCircleElement | null)[]>([]) // index = row * COLS + col
    const status = useRef<SVGCircleElement>(null)
    const mouth = useRef<SVGPathElement>(null)
    const listening = mode === 'listening'
    const spread = useMotionValue(0) // 0 = the 3×3 grip, 1 = the 9×3 meter

    // Levels write straight to the DOM: sixty updates a second is not a React render.
    // Every dot is on or off — no faded dots, which is what made the first pass read as static.
    // A column is a bar of one to three, bottom always lit so it is still a grip, plus a peak
    // that holds for a beat and then falls a row at a time: the LED-meter idiom.
    const peak = useRef(Array.from({ length: COLS }, () => ({ row: 1, t: 0 })))
    useImperativeHandle(ref, () => ({
      setLevels(levels) {
        const now = performance.now()
        const drawn = spread.get() >= 1 // the unroll owns the dots until it lands; the bookkeeping never waits
        for (let c = 0; c < COLS; c++) {
          const l = levels[c] ?? 0
          const bar = l < 0.22 ? 1 : l < 0.62 ? 2 : 3 // against the adaptive ceiling, so the top row is earned
          const pk = peak.current[c]
          if (bar >= pk.row) { pk.row = bar; pk.t = now }
          else if (now - pk.t > PEAK_HOLD) { pk.row = Math.max(bar, pk.row - 1); pk.t = now - (PEAK_HOLD - PEAK_FALL) }
          if (!drawn) continue
          for (let r = 0; r < 3; r++) {
            const fromBottom = 3 - r
            const d = dots.current[r * COLS + c]; if (!d) continue
            d.style.opacity = fromBottom <= bar || fromBottom === pk.row ? '1' : '0'
          }
        }
      },
    }), [spread])

    // The unroll: one progress value drives every column's x and the new columns' arrival, so the
    // grid reads as one thing spreading rather than dots appearing. Columns lag by a few percent each.
    useEffect(() => spread.on('change', p => {
      for (let c = 0; c < COLS; c++) {
        const t = Math.max(0, Math.min(1, p * 1.25 - c * 0.04))
        const e = 1 - Math.pow(1 - t, 3)
        const x = restX(c) + (METER_X(c) - restX(c)) * e
        const arrive = c < 3 ? 1 : Math.max(0, Math.min(1, (p - 0.1 - (c - 3) * 0.07) * 4))
        for (let r = 0; r < 3; r++) {
          const d = dots.current[r * COLS + c]; if (!d) continue
          d.setAttribute('cx', x.toFixed(2))
          // grid → line → meter: the grip's upper rows go out as it spreads, new columns arrive bottom-only
          d.style.opacity = r === 2 ? String(c < 3 ? 1 : arrive) : String(c < 3 ? 1 - p : 0)
        }
      }
      if (status.current) status.current.style.opacity = String(1 - p) // the meter is the status now
    }), [spread])
    useEffect(() => {
      const to = listening ? 1 : 0
      if (reduced) { spread.set(to); return }
      const ctrl = animate(spread, to, { duration: 0.32, ease: EASE })
      return () => ctrl.stop()
    }, [listening, reduced, spread])

    // The mouth is a MotionValue tweened by hand and written straight to the attribute.
    // Not motion.path (it reads its start from the DOM and lands on "undefined" for a frame), and
    // not animate(string, …) either — a string first argument is treated as a CSS selector.
    const d = useMotionValue(FLAT)
    useEffect(() => d.on('change', v => mouth.current?.setAttribute('d', v)), [d])
    useEffect(() => {
      const to = listening ? SMILE : FLAT
      if (reduced) { d.set(to); return }
      const ctrl = animate(d, to, { duration: 0.26, ease: EASE })
      return () => ctrl.stop()
    }, [listening, reduced, d])

    const label = denied ? 'microphone not allowed' : listening ? 'listening' : mode === 'typing' ? 'typing' : mode === 'open' ? 'open' : 'idle'
    return (
      <svg className={`gripper gripper--${mode}${denied ? ' gripper--denied' : ''}`}
        viewBox="0 0 119 64" width="119" height="64" role="img" aria-label={label}>
        {/* one plate, fill only, and a 2px bottom edge — the same language as the field beside it, so the
            pair reads as one instrument and nothing doubles the bar's border above */}
        <rect className="gripper-plate" x="0" y="0" width="119" height="64" />
        <rect className="gripper-edge" x="0" y="62" width="119" height="2" />
        {ROWS.flatMap((y, r) => Array.from({ length: COLS }, (_, c) => (
          <circle key={`${r}${c}`} ref={el => { dots.current[r * COLS + c] = el }} className="gripper-dot"
            cx={restX(c)} cy={y} r="3" style={c >= 3 ? { opacity: 0 } : undefined} />
        )))}
        {/* same inset as the grid (8px), and exactly where the meter's ninth column lands: on unroll it becomes that column */}
        <circle ref={status} className="gripper-status" cx={METER_X(COLS - 1)} cy="11" r="3" />
        <path ref={mouth} className="gripper-mouth" d={FLAT} />
      </svg>
    )
  })
