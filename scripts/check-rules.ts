// A quick check of the chip rules without a browser. `npx tsx scripts/check-rules.ts`
import { CAPABILITIES, applicable, match, asYours } from '../src/episodes/01-live-session/capabilities'

const trigger = CAPABILITIES.find(c => c.kind === 'when')!
const filter = CAPABILITIES.find(c => c.kind === 'only')!
const count = (tokens: typeof CAPABILITIES, kind: string) =>
  applicable(CAPABILITIES, tokens).filter(c => c.kind === kind).length

const rows: [string, number, number][] = [
  ['nothing yet · triggers offered', count([], 'when'), 3],
  ['nothing yet · filters offered', count([], 'only'), 0],
  ['after a trigger · triggers offered', count([trigger], 'when'), 0],
  ['after a trigger · filters offered', count([trigger], 'only'), 1],
  ['after a filter · filters offered', count([trigger, filter], 'only'), 0],
  ['match "summ"', match('summ').length, 1],
  ['match "curate"', match('curate').length, 0],
]
let bad = 0
for (const [name, got, want] of rows) {
  const ok = got === want
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: ${got}${ok ? '' : ` (want ${want})`}`)
}
console.log('yours:', JSON.stringify(asYours('Curate it to my taste')))
process.exit(bad ? 1 : 0)
