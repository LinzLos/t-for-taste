import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(MotionPathPlugin)
import { useReducedMotion } from '../../chassis/reduced-motion'
import { useRegisterBeats } from '../../chassis/beats'
import { meta } from './meta'
import { ATTEMPT, CHIP, EDGES, LOG, NODES, OFFER, RAGE, REVIEW, type Beat, type NodeSpec } from './story'
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

function Connectors({ host, beat, stateOf }: { host: React.RefObject<HTMLDivElement>; beat: Beat; stateOf: (id: string) => string }) {
  const [d, setD] = useState<{ d: string; dashed: boolean; id: string; from: string }[]>([])
  useLayoutEffect(() => {
    const el = host.current; if (!el) return
    const box = el.getBoundingClientRect()
    const k = box.width / 1008 // the stage may be drawn at any scale; the SVG draws in stage units
    const r = (id: string) => { const b = el.querySelector<HTMLElement>(`[data-node="${id}"]`)!.getBoundingClientRect(); const l = (b.left - box.left) / k, t = (b.top - box.top) / k, w = b.width / k, h = b.height / k; return { l, r: l + w, t, b: t + h, cx: l + w / 2, cy: t + h / 2 } }
    setD(EDGES.map(([a, b, dashed]) => {
      const A = r(a), B = r(b)
      const id = `edge-${a}-${b}`
      if (b === 'summarize') return { id, from: a, dashed, d: `M ${A.r} ${A.cy} C ${A.r + 60} ${A.cy} ${B.l - 60} ${B.cy} ${B.l} ${B.cy}` }
      const sx = A.cx + 40
      return { id, from: a, dashed, d: `M ${sx} ${A.b} C ${sx} ${A.b + 70} ${B.cx} ${B.t - 70} ${B.cx} ${B.t}` }
    }))
  }, [host, beat])
  return (
    <svg className="edges" width={1008} height={800} aria-hidden>
      {d.map(e => {
        const st = e.dashed ? 'control' : stateOf(e.from) // control wires (dashed) never carry flow
        const cls = ['edge', e.dashed ? 'edge--dashed' : '', st === 'trying' ? 'edge--flow' : st === 'stuck' ? 'edge--stuck' : 'edge--idle'].join(' ')
        return <path key={e.id} id={e.id} d={e.d} className={cls} />
      })}
      <circle className="pulse" r={7} />
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
  reconnect: { x: 72 + 300 + 175, y: 160 + 500 + 120 },
}
// Where something is, in stage coordinates, whatever scale the stage is drawn at.
function spotOf(root: HTMLElement, sel: string) {
  const r = root.getBoundingClientRect(), t = root.querySelector(sel)?.getBoundingClientRect()
  if (!t) return SPOT.reconnect
  const k = r.width / 1080
  return { x: (t.left - r.left + t.width * 0.55) / k, y: (t.top - r.top + t.height * 0.6) / k }
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
  const [attempts, setAttempts] = useState<string[]>([])
  const [flash, setFlash] = useState<number | null>(null)
  const flashTimer = useRef<number>()
  const pressReconnect = () => {
    if (beat !== 'calm') return
    const n = Math.min(tries + 1, 6)
    setTries(n)
    setAttempts(a => [...a, ATTEMPT(n)])
    setFlash(n); window.clearTimeout(flashTimer.current); flashTimer.current = window.setTimeout(() => setFlash(null), 650)
    rage()
  }
  const pressRef = useRef(pressReconnect); pressRef.current = pressReconnect
  const cursorEl = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [params] = useSearchParams()

  // Autoplay: the cursor walks the story through the same code paths a human uses.
  const play = useCallback(() => {
    if (playing) return
    setTries(2); setAttempts([]); setBeat('calm'); setPlaying(true)
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
    const root = c.closest('.builder') as HTMLElement
    tl.to(c, { x: () => spotOf(root, '.offer-go').x, y: () => spotOf(root, '.offer-go').y, duration: 0.7, ease: 'power2.inOut' }, t + 1.1)
      .to(c, { scale: 0.85, duration: 0.06, yoyo: true, repeat: 1 }, t + 2.2)
      .call(() => setBeat(b => (b === 'threshold' ? 'pressed' : b)), [], t + 2.2)
      .to(c, { autoAlpha: 0, duration: 0.4 }, t + 2.8)
    if (import.meta.env.DEV) Object.assign(window, { __auto: tl })
    return () => tl.kill()
  }, [playing, reduced])

  // Record mode plays itself after a beat, so a recording needs no hands.
  useEffect(() => { if (params.has('record') && !params.has('hold')) { const t = setTimeout(play, 800); return () => clearTimeout(t) } }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // The pulse: something leaves Lotion, gets about halfway, and fizzles. Nothing arrives. That is the story.
  const pulse = useCallback((hot = false) => {
    const el = canvas.current; if (!el || reduced) return
    const path = el.querySelector<SVGPathElement>('#edge-lotion-summarize'), dot = el.querySelector<SVGCircleElement>('.pulse')
    if (!path || !dot) return
    gsap.killTweensOf(dot)
    gsap.timeline()
      .set(dot, { autoAlpha: 1, scale: 1, transformOrigin: '50% 50%', attr: { class: hot ? 'pulse pulse--hot' : 'pulse' } })
      .to(dot, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0, end: 0.42 }, duration: 0.55, ease: 'power2.out' })
      .to(dot, { autoAlpha: 0, scale: 0.2, duration: 0.28, ease: 'power2.in' }, '-=0.08')
  }, [reduced])
  useEffect(() => { if (flash) pulse(true) }, [flash, pulse])
  useEffect(() => {
    if (beat !== 'calm') return
    const first = setTimeout(() => pulse(), 900)
    const id = setInterval(() => pulse(), 2400)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [beat, pulse])

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

  const lines = useMemo(() => beat === 'calm' ? [...LOG.calm, ...attempts.map(t => ({ who: 'sys' as const, text: t }))] : [...LOG.calm, ...LOG.threshold], [beat, attempts])
  const msgsRef = useRef<HTMLDivElement>(null)
  useEffect(() => { const m = msgsRef.current; if (m) m.scrollTop = m.scrollHeight }, [lines])
  const nodes = useMemo(() => NODES.map(n => {
    if (n.id === 'reconnect' && beat === 'calm') return { ...n, pill: { ...n.pill, calm: `try ${tries}` } }
    if (n.id === 'lotion' && beat === 'calm' && flash) return { ...n, pill: { ...n.pill, calm: `reconnecting · try ${flash}` }, state: { ...n.state, calm: 'stuck' as const } }
    return n
  }), [beat, tries, flash])
  const raged = beat === 'threshold' || beat === 'pressed'
  const reset = () => { setTries(2); setAttempts([]); setBeat('calm') }

  // Publish the beats to the chassis so the story can be stepped from the frame bar.
  const go = useCallback((i: number) => { if (BEATS[i] === 'calm') { setTries(2); setAttempts([]) } setBeat(BEATS[i]) }, [])
  const controls = useMemo(() => ({ beats: BEATS, index: BEATS.indexOf(beat), go, play, playing, hint: beat === 'calm' ? 'or rage-click Reconnect, 5 times fast' : beat === 'threshold' ? 'or answer the offer in the chat' : undefined }), [beat, go, play, playing])
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
            <Connectors host={canvas} beat={beat} stateOf={id => nodes.find(n => n.id === id)?.state[beat] ?? 'soft'} />
            {nodes.map(n => <Node key={n.id} n={n} beat={beat} onPress={n.id === 'reconnect' ? pressReconnect : undefined} />)}
          </div>
          <div className="log" ref={logRef}>
            <div className="messages" ref={msgsRef}>
              {lines.map((l, i) => {
                const fade = lines.length - i + (raged ? 1 : 0)
                const cls = l.who === 'user' ? `msg${l.hot ? ' msg--hot' : ''}` : 'sys'
                return <div key={i} className={cls} style={{ opacity: fade > 3 ? 0.35 : fade === 3 ? 0.6 : 1 }}>{l.text}</div>
              })}
              {raged && (
                <div className="offer" role="group" aria-label="the system offers a rundown">
                  <b>{OFFER.title}</b>
                  <span>{OFFER.body}</span>
                  <div className="offer-buttons">
                    <button type="button" className="action" onClick={() => { setTries(2); setAttempts([]); setBeat('calm') }}>{OFFER.secondary}</button>
                    <button type="button" className="primary offer-go" onClick={() => beat === 'threshold' && setBeat('pressed')}>{OFFER.primary}</button>
                  </div>
                </div>
              )}
            </div>
            <div className="composer"><div className="field">Marike, what should change?</div><i className="send" aria-hidden /></div>
          </div>
        </>
      )}
    </div>
  )
}
