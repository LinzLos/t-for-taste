// A quick check of the chip rules without a browser. `npx tsx scripts/check-rules.ts`
import { CAPABILITIES, match, asYours, looksLikeWords } from '../src/episodes/01-live-session/capabilities'

const rows: [string, number, number][] = [
  ['every connected capability is offered', match('').length, CAPABILITIES.length],
  ['match "summ"', match('summ').length, 1],
  ['match "slack"', match('slack').length, 1],
  ['match "curate"', match('curate').length, 0],
  ['words: "jhnkjnlklknk" is not a request', looksLikeWords('jhnkjnlklknk') ? 1 : 0, 0],
  ['words: "summarize it for #growers" is', looksLikeWords('summarize it for #growers') ? 1 : 0, 1],
  ['words: "tell @marike at 9" is', looksLikeWords('tell @marike at 9') ? 1 : 0, 1],
  ['words: "ok" is too short', looksLikeWords('ok') ? 1 : 0, 0],
  ['words: "summarize" alone is', looksLikeWords('summarize') ? 1 : 0, 1],
]
let bad = 0
for (const [name, got, want] of rows) {
  const ok = got === want
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: ${got}${ok ? '' : ` (want ${want})`}`)
}
console.log('yours:', JSON.stringify(asYours('Curate it to my taste')))
process.exit(bad ? 1 : 0)
