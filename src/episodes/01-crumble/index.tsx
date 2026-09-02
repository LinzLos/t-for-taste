import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../chassis/reduced-motion'
import { STAGE } from '../../chassis/Stage'
import { PANEL, makeCracks, makeShards, mulberry32 } from './geometry'
import { meta } from './meta'
import './crumble.css'

export { meta }

const LABEL = 'Fuck this shit.'
// Shards are visual copies. `inert` keeps their buttons out of the tab order; React 18 has no typing for it.
const INERT = { inert: '' } as unknown as Record<string, never>

// Panel geometry on the stage. It hangs from one nail, top centre.
const PX = (STAGE.w - PANEL.w) / 2
const PY = 250
const NAIL = { x: STAGE.w / 2, y: PY + 24 }
const BUTTON = { x: STAGE.w / 2, y: PY + PANEL.h - 96 } // where the cracks start

// The interface that is about to stop existing. Rendered once as the face and
// once per shard, so the shards are real DOM, not a screenshot.
function PanelFace() {
  return (
    <div className="pf">
      <h1 className="pf-title">Campaign<br />controls</h1>
      <div className="pf-row"><span>dial pace</span><i className="pf-meter" style={{ '--v': '72%' } as React.CSSProperties} /><b>1.4×</b></div>
      <div className="pf-row"><span>abandon cap</span><i className="pf-meter" style={{ '--v': '31%' } as React.CSSProperties} /><b>3.0%</b></div>
      <div className="pf-row"><span>after hours</span><i className="pf-switch" /><b>off</b></div>
      <p className="pf-status">queue health: fine, actually</p>
      <button type="button" className="pf-button" data-crumble-button>{LABEL}</button>
    </div>
  )
}

function Scene({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const { reduced } = useReducedMotion()
  const [seed] = useState(() => Math.floor(Math.random() * 1e9))
  const rand = useMemo(() => mulberry32(seed), [seed])
  const shards = useMemo(() => makeShards(rand), [rand])
  const cracks = useMemo(() => makeCracks([BUTTON.x, BUTTON.y], 7, 760, rand), [rand])
  const armed = useRef(true)

  useEffect(() => {
    const el = root.current!
    const ctx = gsap.context(() => {
      // Cracks start fully hidden along their own length.
      gsap.utils.toArray<SVGPathElement>('.crack').forEach(p => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set('.shard', { autoAlpha: 0 })
      gsap.set('.ghost', { autoAlpha: 0 })
    }, el)
    return () => ctx.revert()
  }, [])

  const go = () => {
    if (!armed.current) return
    armed.current = false
    const el = root.current!
    const q = gsap.utils.selector(el)

    if (reduced) {
      // The twin: it leaves, it doesn't fall.
      gsap.timeline({ onComplete: onDone })
        .to(q('.panel'), { autoAlpha: 0, duration: 0.2, ease: 'none' })
        .to(q('.ghost'), { autoAlpha: 1, duration: 0.2 }, '<')
      return
    }

    // Shards nearest the button leave first.
    const order = shards
      .map((s, i) => ({ i, d: Math.hypot(PX + s.cx - BUTTON.x, PY + s.cy - BUTTON.y) }))
      .sort((a, b) => a.d - b.d)
      .map(o => o.i)
    const shardEls = q<HTMLDivElement>('.shard')
    const ordered = order.map(i => shardEls[i])

    const tl = gsap.timeline({ onComplete: onDone })
      .to(q('[data-crumble-button]'), { y: 3, duration: 0.08, ease: 'power2.out' })
      .to(q('.crack'), { strokeDashoffset: 0, duration: 0.62, stagger: 0.04, ease: 'power1.inOut' }, '+=0.06')
      .to(q('.panel'), { rotation: -2.4, y: 10, transformOrigin: `${NAIL.x - PX}px ${NAIL.y - PY}px`, duration: 0.32, ease: 'power3.out' }, '-=0.2')
      .add('fracture', '+=0.18')
      .set(q('.face'), { autoAlpha: 0 }, 'fracture')
      .set(q('.shard'), { autoAlpha: 1 }, 'fracture')
      .to(ordered, {
        y: () => 1500 + rand() * 300,
        x: () => (rand() - 0.5) * 240,
        rotation: () => (rand() - 0.5) * 140,
        duration: () => 0.95 + rand() * 0.4,
        ease: 'power2.in',
        stagger: 0.012,
      }, 'fracture')
      .to(q('.dust'), { scale: 2.6, autoAlpha: 0, duration: 0.9, ease: 'power2.out', stagger: 0.03 }, 'fracture')
      .set(q('.dust'), { autoAlpha: 0.55, scale: 0.4 }, 'fracture-=0.01')
      .to(q('.ghost'), { autoAlpha: 1, duration: 0.6, ease: 'none' }, 'fracture+=0.6')

    // Dev only: `__tl.pause().seek(1.3)` in the console to tune a frame or grab a poster.
    if (import.meta.env.DEV) Object.assign(window, { __tl: tl, __gsap: gsap })
  }

  return (
    <div className="crumble" ref={root}>
      <svg className="cracks" width={STAGE.w} height={STAGE.h} aria-hidden>
        {cracks.map((d, i) => <path key={i} className="crack" d={d} />)}
      </svg>

      <div className="ghost" style={{ left: PX, top: PY, width: PANEL.w, height: PANEL.h }} />
      <div className="nail" style={{ left: NAIL.x, top: NAIL.y }} />

      <div className="panel" style={{ left: PX, top: PY, width: PANEL.w, height: PANEL.h }} onClickCapture={e => {
        if ((e.target as HTMLElement).closest('[data-crumble-button]')) go()
      }}>
        <div className="face"><PanelFace /></div>
        {shards.map((s, i) => (
          <div key={i} className="shard" style={{ clipPath: s.clip, transformOrigin: `${s.cx}px ${s.cy}px` }} aria-hidden {...INERT}>
            <PanelFace />
          </div>
        ))}
      </div>

      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="dust" style={{ left: BUTTON.x + (i - 2.5) * 46, top: BUTTON.y + (i % 2 ? 18 : -14) }} aria-hidden />
      ))}
    </div>
  )
}

// Remounting is the honest reset: fresh seed, fresh cracks, fresh shards.
export default function Crumble() {
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(false)
  return (
    <div className="crumble-root" onClick={() => { if (done) { setDone(false); setRun(r => r + 1) } }}>
      <Scene key={run} onDone={() => setDone(true)} />
      {done && <p className="rehang">tap to rehang</p>}
    </div>
  )
}
