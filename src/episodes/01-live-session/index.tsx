import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useReducedMotion } from '../../chassis/use-reduced-motion'
import { useRegisterBeats } from '../../chassis/use-beats'
import { CAPABILITIES, SCRIPT, asYours, match, type Capability } from './capabilities'
import './composer.css'

const MAX_LINES = 5
const EMPTY_HELP_DELAY = 220 // the gap is the message
const TYPE_MS = 55

export default function LiveSession() {
  const { reduced } = useReducedMotion()
  const [query, setQuery] = useState('')
  const [tokens, setTokens] = useState<Capability[]>([])
  // Phrases the user has committed. They come back as suggestions, marked as theirs, never as capability.
  const [learned, setLearned] = useState<Capability[]>([])
  const [built, setBuilt] = useState<Capability[] | null>(null)
  const [open, setOpen] = useState(false) // the grip's job: pull it and the session is there
  const [voice, setVoice] = useState(false)
  const [level, setLevel] = useState(0) // speech envelope; simulated here, amplitude in a real product
  const [focused, setFocused] = useState(false)
  const [helpFor, setHelpFor] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const field = useRef<HTMLTextAreaElement>(null)
  const [scope, animate] = useAnimate()
  const from = useRef<DOMRect | null>(null) // where the chip was standing when it was taken
  const cancel = useRef(false)
  const [params] = useSearchParams()

  const taken = useMemo(() => new Set(tokens.map(t => t.id)), [tokens])
  // The row shows what is connected, filtered only by what you type. Hiding a chip because of a
  // sequence rule is the interface being clever at you: you saw it a second ago and it vanished
  // with no reason on screen. Absence only means something when it means "not connected".
  const chips = useMemo(() => match(query, learned).filter(c => !taken.has(c.id)), [query, taken, learned])
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
  useEffect(grow, [query, tokens, grow])

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
  // With nothing typed it submits, so Enter always means "commit the thing in front of me".
  const submit = useCallback(() => {
    if (!tokens.length) return
    setBuilt(tokens); setTokens([]); setQuery('')
  }, [tokens])
  const commit = useCallback(() => {
    if (!query.trim()) { submit(); return }
    const top = chips[0]
    if (top) { take(top); return }
    askAnyway()
  }, [query, chips, take, askAnyway, submit])

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

  // Types like a person, so a recording needs no hands.
  const play = useCallback(() => {
    if (playing) return
    cancel.current = false
    setPlaying(true); setTokens([]); setQuery(''); setOpen(true); setFocused(true)
    const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
    const run = async () => {
      await wait(600)
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
          await wait(1600) // let the empty state land
        }
      }
      setPlaying(false)
    }
    void run()
  }, [playing, take])

  // While listening, the mouth moves because something is being said, not on a timer.
  // Simulated for the demo; in a real product this is microphone amplitude.
  useEffect(() => {
    if (!voice || reduced) return // level is read as 0 when not listening, so nothing to reset
    let raf = 0, target = 0, cur = 0, next = 0
    const tick = (t: number) => {
      if (t > next) { target = Math.random() ** 1.6; next = t + 90 + Math.random() * 120 }
      cur += (target - cur) * 0.18
      setLevel(cur)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [voice, reduced])

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
    go: () => { cancel.current = true; setPlaying(false); setTokens([]); setQuery(''); setFocused(false) },
    play,
    playing,
    hint: 'or type in it yourself',
  }), [play, playing])
  useRegisterBeats(controls)

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.7 }

  return (
    <div className="session" ref={scope} onClick={() => field.current?.focus()}>
      <header className="bar">
        <span className="nav" aria-hidden><i /></span>
        <span className="project">some days are better than others</span>
        <span className="agent">Ms. Fun Agent</span>
      </header>

      <div className={`composer${focused ? ' composer--on' : ''}${open ? ' composer--open' : ''}`}>
        {/* grip for something you drag; a face would be for something you talk to */}
        <button
          type="button"
          className={`grip${voice ? ' grip--face' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'hide the session' : 'show the session'}
          onMouseDown={e => e.preventDefault()}
          onClick={e => { e.stopPropagation(); setOpen(o => !o); if (open) setVoice(false) }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} data-dot={i} style={voice && i === 7 ? { transform: `translateY(${(voice ? level * 5 : 0).toFixed(1)}px)` } : undefined} />
          ))}
        </button>

        {open && <>
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
              placeholder={voice ? 'Listening' : tokens.length ? 'and then…' : 'Describe what you want to build'}
              onFocus={() => setFocused(true)}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Backspace' && !query && tokens.length) setTokens(t => t.slice(0, -1))
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() }
              }}
            />
          </div>
          <button type="button" className={`mic${voice ? ' mic--on' : ''}`} aria-label={voice ? 'stop listening' : 'speak'}
            aria-pressed={voice} onMouseDown={e => e.preventDefault()}
            onClick={e => { e.stopPropagation(); setVoice(v => !v) }}><i /></button>
          <button type="button" className="send" aria-label="build it" disabled={!tokens.length}
            onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); submit() }} />
        </div>


        <div className="chips">
          <AnimatePresence mode="popLayout" initial={false}>
            {chips.map((c, i) => (
              <motion.button
                key={c.id}
                type="button"
                layout={!reduced}
                className={`chip chip--${c.kind}`}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, transition: { duration: 0.1, ease: [0.32, 0, 0.67, 0] } }}
                transition={reduced ? { duration: 0 } : { duration: 0.18, delay: i * 0.012, ease: [0.33, 1, 0.68, 1] }}
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
            <span>Nothing connected can do that yet</span>
            <button type="button" className="chip chip--offer"
              onMouseDown={e => e.preventDefault()} onClick={askAnyway}>Ask for it anyway</button>
          </motion.div>
        )}

        </>}

        {built && (
          <motion.p className="built" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onAnimationComplete={() => setTimeout(() => setBuilt(null), 2600)}>
            Built: {built.map(b => b.label).join(' → ')}
            {built.some(b => b.kind === 'yours') && <span className="built-warn"> · one step is not connected yet</span>}
          </motion.p>
        )}
      </div>
    </div>
  )
}
