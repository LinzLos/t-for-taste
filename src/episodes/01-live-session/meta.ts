import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'live-session',
  title: 'Listen Grip', // her name for it (2026-09-08)
  blurb: 'A shape around starting a conversation.',
  material: 'an LED meter on a grip',
  library: 'motion',
  // ELI5 pass (Lindsay, 2026-09-06): nothing a person outside the tool must look up. One sentence each.
  caption: {
    default: "A voice button shows a wiggling line whether or not you're talking.",
    change: 'Press the grip and it listens through your mic, nothing else. The dots unroll into a sound meter, and only your voice moves it.',
    // For the thing, and only the fact: no claim about what anyone will feel or remember (Lindsay, 2026-09-06).
    reason: 'A thing you press, that answers only you.',
    not: "It doesn't write down what you say. That's a different build. This one is the press, and the listening. Where a request goes once you've kept it is the next one.",
  },
  // The numbers table is cut: a number without the decision it serves is trivia, and it drifts.
  // The spec in docs/ is the "if you're stealing this".
  // Six colours, one job each. The three that mean something are the ones a viewer has to learn.
  palette: [
    { hex: '#241f27', job: 'the ground' },
    { hex: '#352c3c', job: 'the field' },
    { hex: '#eaefd3', job: 'words' },
    { hex: '#1b998b', job: 'the system is alive' },
    { hex: '#ff6a1f', job: "you're doing something" },
    { hex: '#ff9b71', job: 'trouble' },
  ],
  values: [],
  embeddable: true,
  status: 'draft',
  // Square: the story is one grip and one field, and a tall frame was empty canvas on every device.
  stage: { w: 1080, h: 1080 },
  fluidMin: 0, // one grip and one field lay themselves out at any width; scaling would shrink the tap target
  height: 460, // a grip and a field: the canvas below them is texture, not a room to fill
}
