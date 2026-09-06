import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'

// One SVG, one viewBox, so it is the same drawing at 56px on a desktop and 44px on a phone.
// The grid is rigid and stays a grid; all the organic quality goes to the mouth, which is a
// single quadratic — only the pull point moves between the flat bar and the smile.
export type GripperMode = 'rest' | 'typing' | 'listening'
export interface GripperHandle { setLevels: (levels: number[]) => void }

const ROWS = [11, 19, 27] // top, mid, bottom
const COLS = 9
const GRIP_X = [11, 19, 27] // the 3×3 at rest: 8px pitch
const METER_X = (c: number) => 11 + c * 12 // the 9×3 while listening: 12px pitch, full plate
const restX = (c: number) => GRIP_X[Math.min(c, 2)] // extra columns wait, hidden, on the third
const FLAT = 'M 14 50 Q 59.5 50 105 50'
const SMILE = 'M 20 45 Q 59.5 67 99 45'
const QUIET = 0.22 // upper rows while listening to silence: dimmed, never gone, still a meter
const EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]

export const Gripper = forwardRef<GripperHandle, { mode: GripperMode; denied?: boolean }>(
  function Gripper({ mode, denied }, ref) {
    const { reduced } = useReducedMotion()
    const dots = useRef<(SVGCircleElement | null)[]>([]) // index = row * COLS + col
    const status = useRef<SVGCircleElement>(null)
    const mouth = useRef<SVGPathElement>(null)
    const listening = mode === 'listening'

    // Levels write straight to the DOM: sixty updates a second is not a React render.
    // Bottom row is always lit, so it is a meter rising out of a grip, not dots blinking.
    useImperativeHandle(ref, () => ({
      setLevels(levels) {
        for (let c = 0; c < COLS; c++) {
          const l = levels[c] ?? 0
          const top = dots.current[c], mid = dots.current[COLS + c]
          if (mid) mid.style.opacity = String(QUIET + (1 - QUIET) * Math.min(1, l * 1.6))
          if (top) top.style.opacity = String(QUIET + (1 - QUIET) * Math.max(0, Math.min(1, l * 1.6 - 0.6)))
        }
      },
    }), [])

    // The unroll: one progress value drives every column's x and the new columns' arrival, so the
    // grid reads as one thing spreading rather than dots appearing. Columns lag by a few percent each.
    const spread = useMotionValue(0)
    useEffect(() => spread.on('change', p => {
      for (let c = 0; c < COLS; c++) {
        const t = Math.max(0, Math.min(1, p * 1.25 - c * 0.04))
        const e = 1 - Math.pow(1 - t, 3)
        const x = restX(c) + (METER_X(c) - restX(c)) * e
        const arrive = c < 3 ? 1 : Math.max(0, Math.min(1, (p - 0.1 - (c - 3) * 0.07) * 4))
        for (let r = 0; r < 3; r++) {
          const d = dots.current[r * COLS + c]; if (!d) continue
          d.setAttribute('cx', x.toFixed(2))
          if (c >= 3) d.style.opacity = String(arrive * (r === 2 || p < 1 ? 1 : QUIET))
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

    // Once unrolled, the upper rows settle to the quiet floor until sound lifts them.
    useEffect(() => {
      const quiet = listening ? String(QUIET) : ''
      for (let c = 0; c < 3; c++) for (let r = 0; r < 2; r++) { const d = dots.current[r * COLS + c]; if (d) d.style.opacity = quiet }
    }, [listening])

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

    const label = denied ? 'microphone not allowed' : listening ? 'listening' : mode === 'typing' ? 'typing' : 'idle'
    return (
      <svg className={`gripper gripper--${mode}${denied ? ' gripper--denied' : ''}`}
        viewBox="0 0 119 64" width="119" height="64" role="img" aria-label={label}>
        <rect className="gripper-plate" x="0.5" y="0.5" width="118" height="36" />
        <rect className="gripper-plate" x="0.5" y="36.5" width="118" height="27" />
        {ROWS.flatMap((y, r) => Array.from({ length: COLS }, (_, c) => (
          <circle key={`${r}${c}`} ref={el => { dots.current[r * COLS + c] = el }} className="gripper-dot"
            cx={restX(c)} cy={y} r="3" style={c >= 3 ? { opacity: 0 } : undefined} />
        )))}
        <circle ref={status} className="gripper-status" cx="114" cy="11" r="3" />
        <path ref={mouth} className="gripper-mouth" d={FLAT} />
      </svg>
    )
  })
