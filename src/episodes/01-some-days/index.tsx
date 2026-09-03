import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { useReducedMotion } from '../../chassis/reduced-motion'
import { useRegisterBeats } from '../../chassis/beats'
import { meta } from './meta'
import { CHIP, EDGES, LOG, NODES, RAGE, REVIEW, type Beat, type NodeSpec } from './story'
import './builder.css'

export { meta }

const BEATS: Beat[] = ['calm', 'threshold', 'pressed', 'review']

// ── Rage detector: N presses on the same control inside a window ─────────────
function useRage(onRage: () => void) {
  const stamps = useRef<number[]>([])
  return useCallback(() => {
    const now = performance.now()
    stamps.current = stamps.current.filter(t => now - t < RAGE.windowMs)
    stamps.current.push(now)
    if (stamps.current.length >= RAGE.presses) { stamps.current = []; onRage() }
  }, [onRage])
}

// ── Pieces ───────────────────────────────────────────────────────────────────
function Node({ n, beat, onPress }: { n: NodeSpec; beat: Beat; onPress?: () => void }) {
  const state = n.state[beat]
  const pill = n.pill[beat]
  return (
    <div
      className={`node node--${state}${n.dashed ? ' node--dashed' : ''}`}
      style={{ left: n.x, top: n.y }}
      data-node={n.id}
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : undefined}
    >
      <span className="node-type">{n.type}</span>
      <span className="node-title">{n.title}</span>
      <span className="node-sub">{n.sub}</span>
      {pill && <span className="pill">{pill}</span>}
    </div>
  )
}

function Connectors({ host, beat }: { host: React.RefObject<HTMLDivElement>; beat: Beat }) {
  const [d, setD] = useState<{ d: string; dashed: boolean }[]>([])
  useLayoutEffect(() => {
    const el = host.current; if (!el) return
    const box = el.getBoundingClientRect()
    const r = (id: string) => { const b = el.querySelector<HTMLElement>(`[data-node="${id}"]`)!.getBoundingClientRect(); return { l: b.left - box.left, r: b.right - box.left, t: b.top - box.top, b: b.bottom - box.top, cx: b.left - box.left + b.width / 2, cy: b.top - box.top + b.height / 2 } }
    setD(EDGES.map(([a, b, dashed]) => {
      const A = r(a), B = r(b)
      if (a === 'lotion') return { dashed, d: `M ${A.r} ${A.cy} C ${A.r + 40} ${A.cy} ${B.l - 40} ${B.cy} ${B.l} ${B.cy}` }
      const sx = b === 'tell' ? A.l + 60 : A.r - 60
      return { dashed, d: `M ${sx} ${A.b} C ${sx} ${A.b + 60} ${B.cx} ${B.t - 60} ${B.cx} ${B.t}` }
    }))
  }, [host, beat])
  return (
    <svg className="edges" width={1008} height={800} aria-hidden>
      {d.map((e, i) => <path key={i} d={e.d} className={e.dashed ? 'edge edge--dashed' : 'edge'} />)}
    </svg>
  )
}

function Review({ onReset }: { onReset: () => void }) {
  return (
    <section className="review">
      <h2>{REVIEW.title}</h2>
      <p className="review-sum">{REVIEW.summary}</p>
      <ol className="findings">
        {REVIEW.findings.map(f => (
          <li key={f.n} className={f.hot ? 'hot' : undefined}>
            <span className="num">{f.n}</span>
            <div className="body"><b>{f.title}</b><span>{f.detail}</span></div>
            {f.action && <button type="button" className="action">{f.action}</button>}
          </li>
        ))}
      </ol>
      <div className="review-foot">
        <p>{REVIEW.question}</p>
        <div className="buttons">
          <button type="button" className="action">{REVIEW.secondary}</button>
          <button type="button" className="primary" onClick={onReset}>{REVIEW.primary}</button>
        </div>
      </div>
    </section>
  )
}

// ── The cursor: a scripted actor so viewers can see what is being clicked ────
function Cursor({ el }: { el: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="cursor" ref={el} aria-hidden>
      <svg width="32" height="46" viewBox="0 0 32 46"><path d="M2 2 L2 38 L12 29 L18 44 L25 41 L19 27 L30 27 Z" /></svg>
    </div>
  )
}

// Stage coordinates of the things the cursor visits (builder space, 1080 × 1350).
const SPOT = {
  composer: { x: 640, y: 1290 },
  reconnect: { x: 72 + 640 + 175, y: 160 + 510 + 120 },
  rage: { x: 72 + 640 + 175, y: 160 + 700 + 40 },
}
// Click intervals: a person losing patience. The 6th click is the one that crosses 5-in-1.5s.
const CLICK_GAPS = [0, 0.7, 0.45, 0.3, 0.2, 0.15]

// ── The episode ──────────────────────────────────────────────────────────────
export default function SomeDays() {
  const [beat, setBeat] = useState<Beat>('calm')
  const [tries, setTries] = useState(2)
  const { reduced } = useReducedMotion()
  const canvas = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const rage = useRage(() => setBeat(b => (b === 'calm' ? 'threshold' : b)))
  const pressReconnect = () => { if (beat === 'calm') { setTries(t => Math.min(t + 1, 6)); rage() } }
  const pressRef = useRef(pressReconnect); pressRef.current = pressReconnect
  const cursorEl = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [params] = useSearchParams()

  // Autoplay: the cursor walks the story through the same code paths a human uses.
  const play = useCallback(() => {
    if (playing) return
    setTries(2); setBeat('calm'); setPlaying(true)
    if (reduced) { const t = setTimeout(() => { setBeat('threshold'); setTimeout(() => setBeat('pressed'), 900) }, 900); return () => clearTimeout(t) }
    const c = cursorEl.current!
    const tl = gsap.timeline({ onComplete: () => setPlaying(false) })
    tl.set(c, { x: SPOT.composer.x, y: SPOT.composer.y, autoAlpha: 0, scale: 1 })
      .to(c, { autoAlpha: 1, duration: 0.3 }, 0.4)
      .to(c, { x: SPOT.reconnect.x, y: SPOT.reconnect.y, duration: 0.9, ease: 'power2.inOut' }, 0.6)
    let t = 1.7
    CLICK_GAPS.forEach(gap => {
      t += gap
      tl.to(c, { scale: 0.85, duration: 0.06, yoyo: true, repeat: 1 }, t)
      tl.call(() => pressRef.current(), [], t)
    })
    tl.to(c, { x: SPOT.rage.x, y: SPOT.rage.y, duration: 0.6, ease: 'power2.inOut' }, t + 0.7)
      .to(c, { scale: 0.85, duration: 0.06, yoyo: true, repeat: 1 }, t + 1.6)
      .call(() => setBeat(b => (b === 'threshold' ? 'pressed' : b)), [], t + 1.6)
      .to(c, { autoAlpha: 0, duration: 0.4 }, t + 2.2)
    if (import.meta.env.DEV) Object.assign(window, { __auto: tl })
    return () => tl.kill()
  }, [playing, reduced])

  // Record mode plays itself after a beat, so a recording needs no hands.
  useEffect(() => { if (params.has('record') && !params.has('hold')) { const t = setTimeout(play, 800); return () => clearTimeout(t) } }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Placeholder melt: cards soften, then slide off. The real choreography comes from Lindsay's Figma pass.
  useEffect(() => {
    if (beat !== 'pressed') return
    const el = canvas.current!
    const cards = el.querySelectorAll<HTMLElement>('.node')
    if (reduced) { const t = setTimeout(() => setBeat('review'), 200); return () => clearTimeout(t) }
    const tl = gsap.timeline({ onComplete: () => setBeat('review') })
      .to(cards, { borderRadius: 48, duration: 0.35, ease: 'power2.out', stagger: 0.04 })
      .to(cards, { y: 900, rotation: () => (Math.random() - 0.5) * 8, duration: 1.35, ease: 'power2.in', stagger: 0.06 }, '+=0.15')
      .to(logRef.current, { y: 500, autoAlpha: 0, duration: 1.0, ease: 'power2.in' }, '<0.2')
    if (import.meta.env.DEV) Object.assign(window, { __tl: tl, __gsap: gsap })
    return () => { tl.kill() }
  }, [beat, reduced])

  // Keyboard stepping for review and recording: ← → move between beats.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = BEATS.indexOf(beat)
      if (e.key === 'ArrowRight' && i < BEATS.length - 1) setBeat(BEATS[i + 1])
      if (e.key === 'ArrowLeft' && i > 0) setBeat(BEATS[i - 1])
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [beat])

  const lines = useMemo(() => beat === 'calm' ? LOG.calm : [...LOG.calm, ...LOG.threshold], [beat])
  const msgsRef = useRef<HTMLDivElement>(null)
  useEffect(() => { const m = msgsRef.current; if (m) m.scrollTop = m.scrollHeight }, [lines])
  const nodes = useMemo(() => NODES.map(n => n.id === 'reconnect' && beat === 'calm' ? { ...n, pill: { ...n.pill, calm: `try ${tries}` } } : n), [beat, tries])
  const raged = beat === 'threshold' || beat === 'pressed'
  const reset = () => { setTries(2); setBeat('calm') }

  // Publish the beats to the chassis so the story can be stepped from the frame bar.
  const go = useCallback((i: number) => { if (BEATS[i] === 'calm') setTries(2); setBeat(BEATS[i]) }, [])
  const controls = useMemo(() => ({ beats: BEATS, index: BEATS.indexOf(beat), go, play, playing, hint: beat === 'calm' ? 'or rage-click Reconnect, 5 times fast' : beat === 'threshold' ? 'or press the button' : undefined }), [beat, go, play, playing])
  useRegisterBeats(controls)

  return (
    <div className={`builder beat-${beat}`} key={beat === 'calm' ? 'fresh' : 'run'}>
      <header className="bar">
        <div className="row1">
          <span className="menu" aria-hidden><i /><i /><i /></span>
          <span className="project">some days are better than others</span>
          <button type="button" className="publish" data-label="Publish"><span>Publish</span></button>
        </div>
        <div className="row2">
          <span className="chip">tuliptech-docs</span>
          <span className="chip">main</span>
          <span className="chip">sonnet-5 · auto</span>
          <span className={`chip chip--${beat === 'review' ? 'live' : raged ? 'hot' : 'live'}`}>{CHIP[beat]}</span>
        </div>
      </header>

      <nav className="rail" aria-label="builder sections">
        {['chat', 'nodes', 'files', 'logs', 'deploy'].map((n, i) => <span key={n} className={i === 1 ? 'on' : undefined} title={n} />)}
      </nav>

      <Cursor el={cursorEl} />
      {beat === 'review' ? (
        <Review onReset={reset} />
      ) : (
        <>
          <div className="canvas" ref={canvas}>
            <Connectors host={canvas} beat={beat} />
            {nodes.map(n => <Node key={n.id} n={n} beat={beat} onPress={n.id === 'reconnect' ? pressReconnect : undefined} />)}
            {raged && (
              <button type="button" className="rage" style={{ left: 640, top: 700 }} onClick={() => beat === 'threshold' && setBeat('pressed')}>
                Fuck this shit.
              </button>
            )}
          </div>
          <div className="log" ref={logRef}>
            <div className="messages" ref={msgsRef}>
              {lines.map((l, i) => {
                const fade = lines.length - i
                const cls = l.who === 'user' ? `msg${l.hot ? ' msg--hot' : ''}` : 'sys'
                return <div key={i} className={cls} style={{ opacity: fade > 3 ? 0.35 : fade === 3 ? 0.6 : 1 }}>{l.text}</div>
              })}
            </div>
            <div className="composer"><div className="field">Marike, what should change?</div><i className="send" aria-hidden /></div>
          </div>
        </>
      )}
    </div>
  )
}
