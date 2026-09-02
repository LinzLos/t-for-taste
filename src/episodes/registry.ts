// Metas only. Node imports this file to write the manifest, so no React here.
// Add one line per episode. Order doesn't matter; the index sorts by number.
import { meta as crumble } from './01-crumble/meta'
import type { EpisodeMeta } from './types'

export const metas: EpisodeMeta[] = [crumble]
