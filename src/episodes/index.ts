// Components, lazy-loaded per route so one heavy episode never taxes another.
import { lazy } from 'react'
import { metas } from './registry'

const loaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'some-days': () => import('./01-some-days'),
}

export const episodes = metas
  .slice()
  .sort((a, b) => a.number - b.number)
  .map(meta => ({ meta, Component: lazy(loaders[meta.slug]) }))

export { metas }
