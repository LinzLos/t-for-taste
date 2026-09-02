// Writes public/episodes.json from the live episodes in the registry.
// Runs on `npm run manifest` and automatically before `npm run build`.
import { writeFileSync, mkdirSync } from 'node:fs'
import { metas } from '../src/episodes/registry'
import type { ManifestEntry } from '../src/episodes/types'

const SITE = process.env.SITE_URL ?? 'https://linzlos.github.io/t-for-taste'
const pad = (n: number) => String(n).padStart(2, '0')

const entries: ManifestEntry[] = metas
  .filter(m => m.status === 'live')
  .sort((a, b) => b.number - a.number)
  .map(({ status: _status, ...m }) => ({
    ...m,
    url: `${SITE}/#/${pad(m.number)}`,
    poster: `${SITE}/posters/${pad(m.number)}.png`,
  }))

mkdirSync('public', { recursive: true })
writeFileSync('public/episodes.json', JSON.stringify({ series: 'T for Taste', generated: new Date().toISOString(), episodes: entries }, null, 2) + '\n')
console.log(`episodes.json: ${entries.length} live of ${metas.length}`)
