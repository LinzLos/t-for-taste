import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { useRegisterBeats } from '../../chassis/use-beats'
import { CAPABILITIES, SCRIPT, asYours, match, type Capability } from './capabilities'
import { Gripper, type GripperHandle } from './Gripper'
import { useMic } from './use-mic'
import './composer.css'

const MAX_LINES = 5
const EMPTY_HELP_DELAY = 220 // the gap is the message
const TYPE_MS = 55
const PROJECTS = ['tuliptech-docs', 'spring-lots-pricing', 'grower-forms']

const Folder = () => (
  <svg className="folder" viewBox="0 0 24 20" width="24" height="20" aria-hidden>
    <path d="M1.5 3.5h7l2 2.5h12v12h-21z" />
  </svg>
)
const MicGlyph = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <path d="M12 17v4" />
  </svg>
)

export default function LiveSession() {
  const { reduced } = useReducedMotion()
  const [project, setProject] = useState<string | null>(null)
  const [picking, setPicking] = useState(false)
  const [pickQuery, setPickQuery] = useState('')
  const [query, setQuery] = useState('')
  const [tokens, setTokens] = useState<Capability[]>([])
  // Phrases the user has committed. They come back as suggestions, marked as theirs, never as capability.
  const [learned, setLearned] = useState<Capability[]>([])
  const [built, setBuilt] = useState<Capability[] | null>(null)
  const [voice, setVoice] = useState(false)
  const [focused, setFocused] = useState(false)
  const [helpFor, setHelpFor] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const field = useRef<HTMLTextAreaElement>(null)
  const grip = useRef<GripperHandle>(null)
  const [scope, animate] = useAnimate()
  const from = useRef<DOMRect | null>(null) // where the chip was standing when it was taken
  const cancel = useRef(false)
  const [params] = useSearchParams()
  const face = params.has('face') // preview the listening face without a microphone, for tuning and recording

  // Real sound drives the grip. It cannot perform, because it has nothing to perform with.
  const mic = useMic(levels => grip.current?.setLevels(levels))
  const toggleVoice = useCallback(() => {
    if (voice) { mic.stop(); setVoice(false); return }
    setVoice(true)
    void mic.start().then(ok => { if (!ok) setVoice(false) }) // denied: the face never appears
  }, [voice, mic])

  const taken = useMemo(() => new Set(tokens.map(t => t.id)), [tokens])
  // The row shows what is connected, filtered only by what you type. Hiding a chip because of a
  // sequence rule is the interface being clever at you: you saw it a second ago and it vanished
  // with no reason on screen. Absence only means something when it means "not connected".
  const chips = useMemo(() => match(query, learned), [query, learned])
  const offer = useMemo(() => chips.filter(c => !taken.has(c.id)), [chips, taken])
  const empty = focused && chips.length === 0

  // The help arrives after the emptiness has registered, never with it — and never while
  // they are still typing, since the timer restarts on every keystroke.
  useEffect(() => {
    if (!empty) return
    const t = setTimeout(() => setHelpFor(query), EMPTY_HELP_DELAY)
    return () => clearTimeout(t)
  }, [empty, query])
  const showHelp = empty && helpFor === query

  // Growth: the box follows the text. Never eased — an eased height makes typing feel laggy.
  const grow = useCallback(() => {
    const el = field.current; if (!el) return
    el.style.height = 'auto'
    const line = parseFloat(getComputedStyle(el).lineHeight) || 34
    el.style.height = `${Math.min(el.scrollHeight, line * MAX_LINES)}px`
  }, [])
  useEffect(grow, [query, tokens, project, grow])

  // Clicking a token removes it. A step takes its trailing conditions with it, because a
  // condition with nothing to guard is not a thing you can leave lying around.
  const drop = useCallback((i: number) => {
    setTokens(t => {
      const next = t.slice()
      let end = i + 1
      if (next[i].kind !== 'only') while (end < next.length && next[end].kind === 'only') end++
      next.splice(i, end - i)
      return next
    })
  }, [])

  const take = useCallback((c: Capability, rect?: DOMRect) => {
    from.current = rect ?? null
    setTokens(t => [...t, c])
    setQuery('')
    field.current?.focus()
  }, [])

  // Enter on something nothing can do commits it anyway, as yours.
  const askAnyway = useCallback(() => {
    const label = query.trim(); if (!label) return
    const c = asYours(label)
    setLearned(l => (l.some(x => x.id === c.id) ? l : [...l, c]))
    take(c)
  }, [query, take])

  // Enter takes the top match if there is one, otherwise commits what you typed as yours.
  // With nothing typed it builds, so Enter always means "commit the thing in front of me".
  const submit = useCallback(() => {
    if (!tokens.length) return
    setBuilt(tokens); setQuery('') // the tokens stay: building is not a way to lose your work
  }, [tokens])
  const commit = useCallback(() => {
    if (!query.trim()) { submit(); return }
    const top = offer[0]
    if (top) { take(top); return }
    askAnyway()
  }, [query, offer, take, askAnyway, submit])

  // The travel: measure where the chip stood, put the new token there, and let it move home.
  // Explicit rather than a shared-layout id, so the chip's exit and the token's arrival never fight.
  useEffect(() => {
    const rect = from.current; from.current = null
    const last = tokens[tokens.length - 1]
    if (!rect || !last || reduced) return
    const root = scope.current as HTMLElement | null
    const el = root?.querySelector(`[data-token="${last.id}"]`) as HTMLElement | null
    if (!el) return
    const now = el.getBoundingClientRect()
    void animate(el,
      { x: [rect.left - now.left, 0], y: [rect.top - now.top, 0], scale: [1, 1.04, 1] },
      { duration: 0.32, ease: [0.33, 1, 0.68, 1], times: [0, 1] })
  }, [tokens, reduced, animate, scope])

  // Picks a project and types like a person, so a recording needs no hands.
  const play = useCallback(() => {
    if (playing) return
    cancel.current = false
    setPlaying(true); setTokens([]); setQuery(''); setBuilt(null); setProject(null); setPicking(false)
    const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    const run = async () => {
      await wait(700); if (cancel.current) return
      setPicking(true)
      await wait(900); if (cancel.current) return
      setProject(PROJECTS[0]); setPicking(false)
      await wait(700); if (cancel.current) return
      field.current?.focus(); setFocused(true)
      await wait(400)
      for (const step of SCRIPT) {
        for (let i = 1; i <= step.type.length; i++) {
          if (cancel.current) return
          setQuery(step.type.slice(0, i))
          await wait(TYPE_MS + Math.random() * 40)
        }
        await wait(700)
        if (cancel.current) return
        if (step.pick) {
          const c = CAPABILITIES.find(x => x.id === step.pick)!
          take(c)
          await wait(600)
        } else {
          await wait(2200) // let the empty state land, then hand back something they can act from
          if (cancel.current) return
          setQuery('')
        }
      }
      setPlaying(false)
    }
    void run()
  }, [playing, take])

  useEffect(() => () => { cancel.current = true }, [])

  // Record mode plays itself, so a recording needs no hands. `&hold` stops that.
  const started = useRef(false)
  useEffect(() => {
    if (started.current || !params.has('record') || params.has('hold')) return
    started.current = true
    const t = setTimeout(play, 700); return () => clearTimeout(t)
  }, [params, play])

  const controls = useMemo(() => ({
    beats: ['rest'] as const,
    index: 0,
    go: () => { cancel.current = true; setPlaying(false); setTokens([]); setQuery(''); setBuilt(null); setProject(null); setPicking(false); setFocused(false) },
    play,
    playing,
    hint: 'or pick a project yourself',
  }), [play, playing])
  useRegisterBeats(controls)

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.7 }
  const projects = PROJECTS.filter(p => p.includes(pickQuery.trim().toLowerCase()))
  const status = built ? 'standing by' : 'drafting'

  return (
    <div className="session" ref={scope} onClick={() => { setPicking(false); if (project) field.current?.focus() }}>
      <header className="bar">
        {project ? (
          <>
            <button type="button" className="change" aria-label="change project" aria-expanded={picking}
              onClick={e => { e.stopPropagation(); setPicking(p => !p) }}><Folder /></button>
            <span className="tag">main</span>
            <span className="tag">{project}</span>
            <span className="tag tag--status">{status}</span>
          </>
        ) : (
          <button type="button" className="pick" aria-expanded={picking}
            onClick={e => { e.stopPropagation(); setPicking(p => !p) }}>select project <Folder /></button>
        )}
        <span className="agent">friendly agent composer</span>
      </header>

      {picking && (
        <div className="menu" role="listbox" aria-label="projects" onClick={e => e.stopPropagation()}>
          <input className="menu-search" placeholder="search..." value={pickQuery} autoFocus
            onChange={e => setPickQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && projects[0]) { setProject(projects[0]); setPicking(false); setPickQuery('') } if (e.key === 'Escape') setPicking(false) }} />
          {projects.map(p => (
            <button key={p} type="button" role="option" aria-selected={p === project}
              className={`menu-item${p === project ? ' menu-item--on' : ''}`}
              onClick={() => { setProject(p); setPicking(false); setPickQuery('') }}>{p}</button>
          ))}
        </div>
      )}

      <Gripper ref={grip} mode={voice || face ? 'listening' : focused ? 'typing' : 'rest'} denied={mic.denied} />

      {project && (
        <div className="composer">

          {built && (
            <motion.p className="built" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}>
              {built.map(b => b.label).join(' → ')}
              {built.some(b => b.kind === 'yours') && <span className="built-warn"> · one step is not connected yet</span>}
            </motion.p>
          )}

          <div className={`field${focused ? ' field--on' : ''}`}>
            <div className="field-inner">
              <AnimatePresence initial={false}>
                {tokens.map((t, i) => (
                  <motion.button
                    type="button"
                    key={t.id}
                    data-token={t.id}
                    layout={!reduced}
                    className={`token token--${t.kind}`}
                    transition={spring}
                    exit={{ opacity: 0, scale: 0.92 }}
                    aria-label={`remove ${t.label}`}
                    onMouseDown={e => e.preventDefault()}
                    onClick={e => { e.stopPropagation(); drop(i) }}
                  >
                    {t.label}
                  </motion.button>
                ))}
              </AnimatePresence>
              <textarea
                ref={field}
                className="input"
                rows={1}
                value={query}
                placeholder={voice ? 'Listening' : tokens.length ? 'and then…' : 'Describe your workflow'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && !query && tokens.length) setTokens(t => t.slice(0, -1))
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() }
                }}
              />
            </div>
            <button type="button" className={`mic${voice ? ' mic--on' : ''}${mic.denied ? ' mic--denied' : ''}`}
              aria-label={mic.denied ? 'microphone not allowed' : voice ? 'stop listening' : 'speak'}
              aria-pressed={voice} onMouseDown={e => e.preventDefault()}
              onClick={e => { e.stopPropagation(); toggleVoice() }}><MicGlyph /></button>
          </div>

          <div className="chips">
            <AnimatePresence mode="popLayout" initial={false}>
              {chips.map((c, i) => (
                <motion.button
                  key={c.id}
                  type="button"
                  layout={!reduced}
                  className={`chip chip--${c.kind}${taken.has(c.id) ? ' chip--taken' : ''}${!taken.has(c.id) && c.id === offer[0]?.id && query.trim() ? ' chip--top' : ''}`}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, transition: { duration: 0.1, ease: [0.32, 0, 0.67, 0] } }}
                  transition={reduced ? { duration: 0 } : { duration: 0.18, delay: i * 0.012, ease: [0.33, 1, 0.68, 1] }}
                  disabled={taken.has(c.id)}
                  onClick={e => { e.stopPropagation(); take(c, e.currentTarget.getBoundingClientRect()) }}
                >
                  {c.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {empty && showHelp && (
            <motion.div
              className="empty"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
            >
              <span>No match. Nothing connected does that yet.</span>
              <button type="button" className="chip chip--offer"
                onMouseDown={e => e.preventDefault()} onClick={askAnyway}>Ask for it anyway</button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
