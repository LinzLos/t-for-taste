// Metas only. Node imports this file to write the manifest, so no React here.
// Add one line per episode. Order doesn't matter; the index sorts by number.
import { meta as liveSession } from './01-live-session/meta'
import { meta as someDays } from './04-some-days/meta'
import type { EpisodeMeta } from './types'

// The landing lists only what is being shown. The failure episode is parked, not deleted: add it back here.
export const metas: EpisodeMeta[] = [liveSession]
void someDays
