import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'live-session',
  title: 'It only moves when you do',
  material: 'an LED meter on a grip',
  library: 'motion',
  // ELI5 pass (Lindsay, 2026-09-06): nothing a person outside the tool must look up. One sentence each.
  caption: {
    default: "A voice button shows a wiggling line whether or not you're talking.",
    change: 'Press the grip and it listens through your mic, nothing else. The dots unroll into a sound meter, and only your voice moves it.',
    reason: "A face that moves while you're quiet is a tool pretending to be a person.",
  },
  // The numbers table is cut: a number without the decision it serves is trivia, and it drifts.
  // The spec in docs/ is the "if you're stealing this".
  values: [],
  embeddable: true,
  status: 'draft',
  // Square: the story is one grip and one field, and a tall frame was empty canvas on every device.
  stage: { w: 1080, h: 1080 },
  fluidMin: 0, // one grip and one field lay themselves out at any width; scaling would shrink the tap target
}
