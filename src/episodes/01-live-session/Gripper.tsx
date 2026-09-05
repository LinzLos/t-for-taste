import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'

// One SVG, one viewBox, so it is the same drawing at 56px on a desktop and 44px on a phone.
// The grid is rigid and stays a grid; all the organic quality goes to the mouth, which is a
// single quadratic — only the pull point moves between the flat bar and the smile.
export type GripperMode = 'rest' | 'typing' | 'listening'
export interface GripperHandle { setLevels: (levels: number[]) => void }

const COLS = [11, 19, 27]
const ROWS = [11, 19, 27] // top, mid, bottom
const FLAT = 'M 14 50 Q 59.5 50 105 50'
const SMILE = 'M 20 45 Q 59.5 67 99 45'
const QUIET = 0.22 // the upper rows while listening to silence: dimmed, never gone, still a grip

export const Gripper = forwardRef<GripperHandle, { mode: GripperMode; denied?: boolean }>(
  function Gripper({ mode, denied }, ref) {
    const { reduced } = useReducedMotion()
    const dots = useRef<(SVGCircleElement | null)[]>([])

    // Levels write straight to the DOM: sixty updates a second is not a React render.
    // Bottom row is always lit, so it is a meter rising out of a grip, not dots blinking.
    useImperativeHandle(ref, () => ({
      setLevels(levels) {
        COLS.forEach((_, c) => {
          const l = levels[c] ?? 0
          const top = dots.current[c], mid = dots.current[3 + c]
          if (mid) mid.style.opacity = String(QUIET + (1 - QUIET) * Math.min(1, l * 1.6))
          if (top) top.style.opacity = String(QUIET + (1 - QUIET) * Math.max(0, Math.min(1, l * 1.6 - 0.6)))
        })
      },
    }), [])

    useEffect(() => {
      const quiet = mode === 'listening' ? String(QUIET) : ''
      for (let i = 0; i < 6; i++) { const d = dots.current[i]; if (d) d.style.opacity = quiet }
    }, [mode])

    // The mouth is a MotionValue tweened by hand and written straight to the attribute.
    // Not motion.path (it reads its start from the DOM and lands on "undefined" for a frame), and
    // not animate(string, …) either — a string first argument is treated as a CSS selector.
    const mouth = useRef<SVGPathElement>(null)
    const d = useMotionValue(FLAT)
    useEffect(() => d.on('change', v => mouth.current?.setAttribute('d', v)), [d])
    useEffect(() => {
      const to = mode === 'listening' ? SMILE : FLAT
      if (reduced) { d.set(to); return }
      const ctrl = animate(d, to, { duration: 0.26, ease: [0.33, 1, 0.68, 1] })
      return () => ctrl.stop()
    }, [mode, reduced, d])

    const label = denied ? 'microphone not allowed' : mode === 'listening' ? 'listening' : mode === 'typing' ? 'typing' : 'idle'
    return (
      <svg className={`gripper gripper--${mode}${denied ? ' gripper--denied' : ''}`}
        viewBox="0 0 119 64" width="119" height="64" role="img" aria-label={label}>
        <rect className="gripper-plate" x="0.5" y="0.5" width="118" height="36" />
        <rect className="gripper-plate" x="0.5" y="36.5" width="118" height="27" />
        {ROWS.flatMap((y, r) => COLS.map((x, c) => (
          <circle key={`${r}${c}`} ref={el => { dots.current[r * 3 + c] = el }} className="gripper-dot" cx={x} cy={y} r="3" />
        )))}
        <circle className="gripper-status" cx="114" cy="11" r="3" />
        <path ref={mouth} className="gripper-mouth" d={FLAT} />
      </svg>
    )
  })
