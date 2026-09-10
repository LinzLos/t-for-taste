import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'live-session',
  title: 'Listen Grip', // her name for it (2026-09-08)
  blurb: 'A shape around starting a conversation.',
  material: 'an LED meter on a grip',
  library: 'motion',
  // ELI5 pass (Lindsay, 2026-09-06): nothing a person outside the tool must look up. One sentence each.
  // Lindsay's edit, 2026-09-09. Four fixes: the answers named as they appear on screen, "I" → "It"
  // (the tool never speaks in the first person), and the last line made grammatical.
  caption: {
    default: 'A voice button that dances when you talk.',
    change: 'Press the grip and it listens through your mic, nothing else. The dots unroll into a sound meter, and only your voice moves it. Press again and it asks: go on, keep it, or close.',
    reason: 'A thing you press, that answers only you when you need it. It can be put away and brought back.',
    not: "It doesn't write down what you say. That's a different build. This one is the press, and the listening. Next is how what you say becomes a command, and where it gets saved.",
  },
  // Six colours, one job each. The three that mean something are the ones a viewer has to learn.
  // Every colour the episode uses, and the one job each has. Restraint is not a short list — it is
  // that nothing here does two things. Three of the nine carry state; the rest are the material.
  palette: [
    { hex: '#241f27', job: 'the ground' },
    { hex: '#352c3c', job: 'the field' },
    { hex: '#3f3547', job: 'edges' },
    { hex: '#4f4459', job: 'edges, one step up' },
    { hex: '#eaefd3', job: 'words' },
    { hex: '#98978f', job: 'quiet words' },
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
