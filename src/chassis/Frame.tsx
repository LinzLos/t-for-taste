import { Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { EpisodeMeta } from '../episodes/types'
import { Stage } from './Stage'
import { Caption } from './Caption'
import { useReducedMotion } from './use-reduced-motion'
import { BeatsProvider } from './beats'
import { useBeats } from './use-beats'
import { Footer } from './Footer'

// Everything around an episode. `?record` strips it down to the bare stage
// with the mark, which is what gets screen-captured for LinkedIn.
export function Frame(props: { meta: EpisodeMeta; children: ReactNode }) {
  return <BeatsProvider><FrameInner {...props} /></BeatsProvider>
}

// Under the stage, like a player: play and the beats. The motion toggle lives up in the header —
// it is a setting for the whole page, not a control for the story.
function Transport() {
  const ctl = useBeats()
  if (!ctl) return null
  return (
    <div className="transport">
      {ctl?.play && <button type="button" className="play" onClick={ctl.play} disabled={ctl.playing}>{ctl.playing ? 'playing…' : '▶ play'}</button>}
      {ctl && (
        <div className="beats" role="group" aria-label="story beats">
          {ctl.beats.map((b, i) => (
            <button key={b} type="button" aria-current={i === ctl.index} onClick={() => ctl.go(i)}>{i + 1} {b}</button>
          ))}
        </div>
      )}
      {ctl?.hint && <span className="beats-hint">{ctl.hint}</span>}
    </div>
  )
}

function FrameInner({ meta, children }: { meta: EpisodeMeta; children: ReactNode }) {
  const [params] = useSearchParams()
  const record = params.has('record')
  const { reduced, toggle } = useReducedMotion()

  // The bar settles once the page has moved. A passive scroll listener rather than a sentinel: it is
  // four lines, it cannot be defeated by layout, and one boolean per frame costs nothing.
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <div className={record ? 'frame frame--record' : 'frame'}>
      {!record && (
        <header className="frame-bar" data-stuck={stuck}>
          {/* the wordmark keeps its period here, still and pink; the episode's name is on the stage
              itself, so repeating it in the bar was the same words twice in 40px */}
          <Link to="/" className="back">t for taste<i className="mark-dot" aria-hidden /></Link>
          <button type="button" className="rm-toggle" aria-pressed={reduced} onClick={toggle}>motion {reduced ? 'off' : 'on'}</button>
        </header>
      )}
      <Stage record={record} size={meta.stage} fluidMin={meta.fluidMin} height={meta.height}>
        <Suspense fallback={null}>{children}</Suspense>
      </Stage>
      {!record && <Transport />}
      {!record && <Caption meta={meta} />}
      {!record && <Footer />}
    </div>
  )
}
