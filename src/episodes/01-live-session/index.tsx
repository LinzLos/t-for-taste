import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { useRegisterBeats } from '../../chassis/use-beats'
import { CAPABILITIES, SCRIPT, asYours, heard, looksLikeWords, match, type Capability } from './capabilities'
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

// A tell, not a control: the field looks like a listener while it is one. It appears on the press and
// goes with the listening; the sentence beside it carries the meaning, so it is hidden from readers.
const Ear = ({ live }: { live: boolean }) => (
  <svg className={`ear${live ? ' ear--live' : ''}`} viewBox="0 0 24 24" width="26" height="26" aria-hidden>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <path d="M12 17v4" />
  </svg>
)

export default function LiveSession() {
  const { reduced } = useReducedMotion()
  const [picking, setPicking] = useState(false)
  const [open, setOpen] = useState(false) // the grip opens the composer; nothing else does
  const [note, setNote] = useState<string | null>(null) // one line under the field when a request could not be made
  const [leaving, setLeaving] = useState<null | 'voice' | 'text'>(null) // a close was asked for while something was there
  const [again, setAgain] = useState(false) // listening for a second time: by now they have noticed no words appeared
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
  const gripButton = useRef<HTMLButtonElement>(null)
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
  const listening = mic.state === 'on' || mic.state === 'pending'
  // Closing is a clean slate — nothing was kept, and the field agrees: text and requests go with it.
  // It always releases the mic.
  const shut = useCallback(() => {
    mic.stop(); mic.dismiss(); setOpen(false); setQuery(''); setTokens([]); setBuilt(null); setNote(null); setLeaving(null); setAgain(false)
    gripButton.current?.focus() // focus goes back to the handle, not off the page
  }, [mic])
  // Closing is the one move that throws something away, so it asks first when there is something:
  // a session you were speaking into, or a request you typed. An untouched composer just closes.
  const close = useCallback(() => {
    if (leaving) { shut(); return } // asked once already: the second press is the answer
    if (listening) { mic.stop(); setLeaving('voice'); return } // stopped already: you ended it, nothing to ask
    if (query.trim() || tokens.some(t => t.kind !== 'heard')) { setLeaving('text'); return } // a spoken stub has nothing to lose
    shut()
  }, [leaving, listening, mic, query, tokens, shut])
  const keepGoing = useCallback(() => {
    const was = leaving; setLeaving(null)
    if (was === 'voice') { mic.dismiss(); setAgain(true); void mic.start() } else field.current?.focus()
  }, [leaving, mic])
  // What you said becomes a request — the same object typing makes, and the unit the rest of the
  // composer learns from. It holds no words, and the pill says so, because this build does not transcribe.
  const keepIt = useCallback(() => {
    setLeaving(null); mic.dismiss()
    setTokens(t => [...t, heard(t.length + 1)])
  }, [mic])
  // The grip is a drawer handle: one press opens the composer already listening (the mic starts inside
  // the same click, which is what iOS needs), the next closes it. Stopping the mic is the mic glyph's job,
  // so no control has two meanings and nobody has to remember where they are in a cycle.
  // One control. Press → open, listening. Press → the mic pauses and the field asks (that question is what
  // makes the second press legible). From a fallback text state with nothing typed, press → listen again.
  const press = useCallback(() => {
    if (!open) { setOpen(true); void mic.start(); return }
    const fallback = mic.state === 'denied' || mic.state === 'unsupported' || mic.state === 'lost' || mic.state === 'cancelled'
    if (fallback && !query.trim() && !tokens.length) { mic.dismiss(); void mic.start(); return }
    close()
  }, [mic, open, close, query, tokens.length])
  // One phase, derived once, that every surface reads: the grip, the field, the tag, the mic.
  // Listening comes from the hook's own state, never from a click, so a refusal never shows a face.
  type Phase = 'closed' | 'rest' | 'typing' | 'pending' | 'listening' | 'stopped' | 'cancelled' | 'denied' | 'unsupported' | 'lost' | 'leaving'
  const phase: Phase = face || mic.state === 'on' ? 'listening'
    : !open ? 'closed'
    : leaving ? 'leaving'
    : mic.state === 'pending' ? 'pending'
    : mic.state === 'denied' ? 'denied'
    : mic.state === 'unsupported' ? 'unsupported'
    : mic.state === 'lost' ? 'lost'
    : (mic.state === 'stopped' || mic.state === 'cancelled') && !query ? mic.state
    : focused ? 'typing' : 'rest'

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
    // Not words, not a request. Say so, keep the text so it can be fixed, and mint nothing.
    if (!looksLikeWords(label)) { setNote('Not sure what that means. Try words, like: summarize it for #growers'); return }
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
    if (!query.trim()) { if (chipsOn) submit(); return } // building belongs to the chips story
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
    reset(); cancel.current = false
    // The voice slice enters the way a person does: through the grip. ▶ is a click, so the mic may
    // start inside it; the script then waits for you. The typing script belongs to the chips story.
    if (!chipsOn) { setOpen(true); void mic.start(); return }
    setPlaying(true)
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
  }, [playing, take, reset, chipsOn, pickOn, mic])

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
  // Every surface reads the phase. Adding a phase without all of these is the regression.
  const status = ({ closed: 'idle', rest: built ? 'standing by' : 'drafting', typing: 'drafting', pending: 'asking',
    listening: 'listening', stopped: 'stopped', cancelled: 'drafting', denied: 'no microphone', unsupported: 'no microphone', lost: 'no microphone', leaving: 'stopped' } as const)[phase]
  // The tag's colour is its job: teal = the system is alive, orange = you are doing something, salmon = trouble.
  const tone = ({ closed: 'muted', rest: built ? 'live' : 'ink', typing: 'ink', pending: 'active', listening: 'live',
    stopped: 'muted', cancelled: 'ink', denied: 'hot', unsupported: 'hot', lost: 'hot', leaving: 'muted' } as const)[phase]
  // The field says what is happening, in the tool's voice: it reports, and says where the action is.
  const ask = leaving === 'voice' ? 'You were talking. Go on, keep it, or close?' : 'You were typing. Keep typing, or close?'
  const placeholder = phase === 'leaving' && (leaving === 'voice' || !query) ? ask // the question sits in the box unless your own words are there
    : phase === 'pending' ? 'The browser is asking for the microphone.'
    : phase === 'listening' ? (again ? 'Listening again. Your words would show up here. This one only listens.' : 'Listening. Say what it should do.')
    : phase === 'stopped' ? 'Stopped listening. Nothing you said was saved.'
    : phase === 'cancelled' ? 'Stopped asking for the microphone.'
    : phase === 'denied' ? 'Microphone not allowed. Press the grip to try again, or type.'
    : phase === 'unsupported' ? 'No microphone in this browser. Try Safari or Chrome, or type.'
    : phase === 'lost' ? 'The microphone went away. Press the grip to try again, or type.'
    : tokens.length ? 'and then…' : 'Describe your workflow'
  // A three-way cycle is not a toggle: the grip's name is its next effect.
  const gripLabel = !open ? 'open the composer and listen' : listening ? 'stop listening' : 'close the composer'
  const gripMode = phase === 'listening' ? 'listening' : phase === 'pending' ? 'pending' : phase === 'typing' ? 'typing' : open ? 'open' : 'rest'
  // While it listens (or has just stopped) the field is a sentence, not a text box: nothing to type into,
  // nothing to read but what is happening. The keyboard is the fallback when the mic cannot be used.
  const voiceMode = phase === 'pending' || phase === 'listening' || (phase === 'leaving' && leaving === 'voice')
  // When the mic cannot be used the text box is the fallback: put the keyboard there, do not make them find it.
  const fallback = phase === 'denied' || phase === 'unsupported' || phase === 'lost' || phase === 'cancelled'
  useEffect(() => { if (fallback) field.current?.focus() }, [fallback])
  const edge = phase === 'denied' || phase === 'unsupported' || phase === 'lost' ? ' field--denied' : phase === 'typing' || phase === 'pending' || phase === 'listening' ? ' field--on' : ''

  return (
    <div className="session" ref={scope} onClick={() => setPicking(false)}
      onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); if (picking) setPicking(false); else if (listening) mic.stop(); else if (open) close() } }}>
      <header className="bar">
        <span className="brand">
          <span className="agent">friendly voice composer</span>
          <span className="tagline">Press, talk, keep it.</span>
        </span>
        <span className="scope">
          {project ? (
            <>
              {pickOn && <button type="button" className="change" aria-label="change project" aria-expanded={picking}
                onClick={e => { e.stopPropagation(); setPicking(p => !p) }}><Folder /></button>}
              {pickOn && <span className="tag">main</span>}
              {pickOn && <span className="tag">{project}</span>}
              <span className="status" data-tone={tone}>{status}</span>
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
      <button type="button" className="grip" ref={gripButton} aria-expanded={open} aria-label={gripLabel}
        onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); press() }}>
        <Gripper ref={grip} mode={gripMode} denied={phase === 'denied' || phase === 'unsupported' || phase === 'lost'} />
      </button>

      {project && open && (
        <div className="composer">

          {chipsOn && built && (
            <motion.p className="built" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: EASE }}>
              {built.map(b => b.label).join(' → ')}
              {built.some(b => b.kind === 'yours') && <span className="built-warn"> · one step is not connected yet</span>}
            </motion.p>
          )}

          <div className={`field${edge}`}>
            {voiceMode ? (
              <>
                <p className="input voice-line">{placeholder}</p>
                {(phase === 'pending' || phase === 'listening') && <Ear live={phase === 'listening'} />}
              </>
            ) : (
            <div className={`field-inner${tokens.length ? ' field-inner--stacked' : ''}`}>
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
                onChange={e => { setQuery(e.target.value); setNote(null); mic.dismiss() }}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && !query && tokens.length) setTokens(t => t.slice(0, -1))
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() }
                }}
              />
            </div>
            )}
            {phase === 'leaving' ? (
              <span className="answers">
                <button type="button" className="answer answer--keep" onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); keepGoing() }}>{leaving === 'voice' ? 'go on' : 'keep typing'}</button>
                {leaving === 'voice' && <button type="button" className="answer" onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); keepIt() }}>keep it</button>}
                <button type="button" className="answer" onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); shut() }}>close</button>
              </span>
            ) : null}
          </div>

          {note && <p className="note">{note}</p>}
          {phase === 'leaving' && leaving === 'text' && query.trim() && <p className="note note--ask">{ask}</p>}

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
