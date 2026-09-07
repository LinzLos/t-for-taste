import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { useRegisterBeats } from '../../chassis/use-beats'
import { CAPABILITIES, SCRIPT, asYours, match, type Capability } from './capabilities'
import { Gripper, type GripperHandle } from './Gripper'
import { useMic } from './use-mic'
import { EASE } from './motion'
import './composer.css'

const MAX_LINES = 5
const EMPTY_HELP_DELAY = 220 // the gap is the message
const TYPE_MS = 55
const PROJECTS = ['tuliptech-docs', 'spring-lots-pricing', 'grower-forms']
const VOICE_SCRIPT = [{ type: 'When a page is saved, summarize it for #growers', pick: null }] as const

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
  const [picking, setPicking] = useState(false)
  const [open, setOpen] = useState(false) // the grip opens the composer; nothing else does
  const [pickQuery, setPickQuery] = useState('')
  const [query, setQuery] = useState('')
  const [tokens, setTokens] = useState<Capability[]>([])
  // Phrases the user has committed. They come back as suggestions, marked as theirs, never as capability.
  const [learned, setLearned] = useState<Capability[]>([])
  const [built, setBuilt] = useState<Capability[] | null>(null)
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
  const chipsOn = params.has('chips') // the capability chips are the next episode's story; kept here behind a flag
  const pickOn = params.has('pick') // choosing a project is another episode too; without the flag it is already chosen
  const [project, setProject] = useState<string | null>(() => (pickOn ? null : PROJECTS[0]))

  // Real sound drives the grip. It cannot perform, because it has nothing to perform with.
  const mic = useMic(levels => grip.current?.setLevels(levels))
  const toggleVoice = useCallback(() => {
    if (mic.state === 'on' || mic.state === 'pending') mic.stop(); else void mic.start()
  }, [mic])
  // The grip is the way in: press it and the composer appears already listening. The mic starts
  // inside the same click, which is what iOS needs. Press again to stop; the composer stays.
  const press = useCallback(() => {
    if (mic.state === 'on' || mic.state === 'pending') { mic.stop(); return }
    setOpen(true); void mic.start()
  }, [mic])
  // One phase, derived once, that every surface reads: the grip, the field, the tag, the mic.
  // Listening comes from the hook's own state, never from a click, so a refusal never shows a face.
  const phase = face || mic.state === 'on' ? 'listening' : mic.state === 'pending' ? 'pending' : mic.state === 'denied' ? 'denied' : focused ? 'typing' : 'rest'

  const taken = useMemo(() => new Set(tokens.map(t => t.id)), [tokens])
  // The row shows what is connected, filtered only by what you type. Hiding a chip because of a
  // sequence rule is the interface being clever at you: you saw it a second ago and it vanished
  // with no reason on screen. Absence only means something when it means "not connected".
  const chips = useMemo(() => match(query, learned), [query, learned])
  const offer = useMemo(() => chips.filter(c => !taken.has(c.id)), [chips, taken])
  const empty = chipsOn && focused && chips.length === 0 // the help belongs to the chips

  // The help arrives after the emptiness has registered, never with it — and never while
  // they are still typing, since the timer restarts on every keystroke.
  useEffect(() => {
    if (!empty) return
    const t = setTimeout(() => setHelpFor(query), EMPTY_HELP_DELAY)
    return () => clearTimeout(t)
  }, [empty, query])
  const showHelp = empty && helpFor === query

  // Growth: the box follows the text. Never eased — an eased height makes typing feel laggy.
  const lineH = useRef(0)
  const grow = useCallback(() => {
    const el = field.current; if (!el) return
    if (!lineH.current) lineH.current = parseFloat(getComputedStyle(el).lineHeight) || 34 // measured once: a computed-style read per keystroke is a layout flush
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, lineH.current * MAX_LINES)}px`
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
    const top = chipsOn ? offer[0] : undefined // nothing visible to match against when the chips are off
    if (top) { take(top); return }
    askAnyway()
  }, [query, offer, chipsOn, take, askAnyway, submit])

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
      { duration: 0.32, ease: EASE, times: [0, 1] })
  }, [tokens, reduced, animate, scope])

  // Picks a project and types like a person, so a recording needs no hands.
  const reset = useCallback(() => {
    // Back to the start. It releases the mic too: a composer that has gone must not leave the mic open.
    cancel.current = true; setPlaying(false); mic.stop()
    setTokens([]); setQuery(''); setBuilt(null); setProject(pickOn ? null : PROJECTS[0]); setPicking(false); setOpen(false)
  }, [mic, pickOn])

  const play = useCallback(() => {
    if (playing) return
    reset(); cancel.current = false; setPlaying(true)
    const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    const run = async () => {
      await wait(700); if (cancel.current) return
      if (pickOn) {
        setPicking(true)
        await wait(900); if (cancel.current) return
        setProject(PROJECTS[0]); setPicking(false)
        await wait(700); if (cancel.current) return
      }
      setOpen(true)
      await wait(400); if (cancel.current) return
      field.current?.focus(); setFocused(true)
      await wait(300)
      // With the chips off there is nothing to pick, so the script says one whole thing and stops.
      const script = chipsOn ? SCRIPT : VOICE_SCRIPT
      for (const step of script) {
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
        } else if (chipsOn) {
          await wait(2200) // let the empty state land, then hand back something they can act from
          if (cancel.current) return
          setQuery('')
        } else {
          // no chips to match: the sentence commits as a request, then builds, so the run ends somewhere
          const c = asYours(step.type)
          take(c)
          await wait(700); if (cancel.current) return
          setBuilt([c])
        }
      }
      setPlaying(false)
    }
    void run()
  }, [playing, take, reset, chipsOn, pickOn])

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
    go: () => { reset(); setFocused(false) },
    play,
    playing,
    hint: 'or press the grip yourself',
  }), [play, playing, reset])
  useRegisterBeats(controls)

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.7 }
  const projects = PROJECTS.filter(p => p.includes(pickQuery.trim().toLowerCase()))
  const status = phase === 'listening' ? 'listening' : built ? 'standing by' : 'drafting'
  // The field says what is happening, in the tool's voice: it reports, it never asks you to feel anything.
  const placeholder = phase === 'denied' ? 'Microphone not allowed. Type instead.'
    : phase === 'pending' ? 'Waiting for the microphone'
    : phase === 'listening' ? 'Listening. Say what it should do.'
    : tokens.length ? 'and then…' : 'Describe your workflow'
  const micLabel = phase === 'denied' ? 'microphone not allowed' : phase === 'listening' || phase === 'pending' ? 'stop listening' : 'speak'

  return (
    <div className="session" ref={scope} onClick={() => setPicking(false)}>
      <header className="bar">
        <span className="agent">friendly voice composer</span>
        <span className="scope">
          {project ? (
            <>
              {pickOn && <button type="button" className="change" aria-label="change project" aria-expanded={picking}
                onClick={e => { e.stopPropagation(); setPicking(p => !p) }}><Folder /></button>}
              {pickOn && <span className="tag">main</span>}
              {pickOn && <span className="tag">{project}</span>}
              <span className="tag tag--status">{status}</span>
            </>
          ) : (
            <button type="button" className="pick" aria-expanded={picking}
              onClick={e => { e.stopPropagation(); setPicking(p => !p) }}>select project <Folder /></button>
          )}
        </span>
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

      {/* pressed: everything goes orange at once; listening (the unroll, the smile) only once the browser has said yes */}
      <button type="button" className="grip" aria-pressed={phase === 'listening' || phase === 'pending'} aria-label={micLabel}
        onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); press() }}>
        <Gripper ref={grip} mode={phase === 'listening' ? 'listening' : phase === 'pending' || focused ? 'typing' : 'rest'} denied={phase === 'denied'} />
      </button>

      {project && open && (
        <div className="composer">

          {built && (
            <motion.p className="built" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: EASE }}>
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
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && !query && tokens.length) setTokens(t => t.slice(0, -1))
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() }
                }}
              />
            </div>
            <button type="button" className={`mic mic--${phase}`}
              aria-label={micLabel}
              aria-pressed={phase === 'listening' || phase === 'pending'} onMouseDown={e => e.preventDefault()}
              onClick={e => { e.stopPropagation(); toggleVoice() }}><MicGlyph /></button>
          </div>

          {chipsOn && <div className="chips">
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
                  transition={reduced ? { duration: 0 } : { duration: 0.18, delay: i * 0.012, ease: EASE }}
                  disabled={taken.has(c.id)}
                  onClick={e => { e.stopPropagation(); take(c, e.currentTarget.getBoundingClientRect()) }}
                >
                  {c.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>}

          {chipsOn && empty && showHelp && (
            <motion.div
              className="empty"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
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
