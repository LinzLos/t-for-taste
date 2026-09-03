import { Suspense, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { EpisodeMeta } from '../episodes/types'
import { Stage } from './Stage'
import { Mark } from './Mark'
import { Caption } from './Caption'
import { useReducedMotion } from './reduced-motion'
import { BeatsProvider, useBeats } from './beats'
import { Footer } from './Footer'

// Everything around an episode. `?record` strips it down to the bare stage
// with the mark, which is what gets screen-captured for LinkedIn.
export function Frame(props: { meta: EpisodeMeta; children: ReactNode }) {
  return <BeatsProvider><FrameInner {...props} /></BeatsProvider>
}

// Under the stage, like a player: play, the beats, the motion toggle.
function Transport({ reduced, toggle }: { reduced: boolean; toggle: () => void }) {
  const ctl = useBeats()
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
      <button type="button" className="rm-toggle" aria-pressed={reduced} onClick={toggle}>motion {reduced ? 'off' : 'on'}</button>
    </div>
  )
}

function FrameInner({ meta, children }: { meta: EpisodeMeta; children: ReactNode }) {
  const [params] = useSearchParams()
  const record = params.has('record')
  const { reduced, toggle } = useReducedMotion()

  return (
    <div className={record ? 'frame frame--record' : 'frame'}>
      {!record && (
        <header className="frame-bar">
          <Link to="/" className="back">T for Taste</Link>
          <span className="title">{meta.title}</span>
        </header>
      )}
      <Stage>
        <Suspense fallback={null}>{children}</Suspense>
        <Mark number={meta.number} />
      </Stage>
      {!record && <Transport reduced={reduced} toggle={toggle} />}
      {!record && <Caption meta={meta} />}
      {!record && <Footer />}
    </div>
  )
}
