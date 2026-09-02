import { Suspense, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { EpisodeMeta } from '../episodes/types'
import { Stage } from './Stage'
import { Mark } from './Mark'
import { Caption } from './Caption'
import { useReducedMotion } from './reduced-motion'

// Everything around an episode. `?record` strips it down to the bare stage
// with the mark, which is what gets screen-captured for LinkedIn.
export function Frame({ meta, children }: { meta: EpisodeMeta; children: ReactNode }) {
  const [params] = useSearchParams()
  const record = params.has('record')
  const { reduced, toggle } = useReducedMotion()

  return (
    <div className={record ? 'frame frame--record' : 'frame'}>
      {!record && (
        <header className="frame-bar">
          <Link to="/" className="back">T for Taste</Link>
          <span className="title">{meta.title}</span>
          <button type="button" className="rm-toggle" aria-pressed={reduced} onClick={toggle}>
            motion {reduced ? 'off' : 'on'}
          </button>
        </header>
      )}
      <Stage>
        <Suspense fallback={null}>{children}</Suspense>
        <Mark number={meta.number} />
      </Stage>
      {!record && <Caption meta={meta} />}
    </div>
  )
}
