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
  // Grouped the way Lindsay laid them out: what a colour is for comes before what it is.
  palette: [
    { group: 'States', items: [
      { hex: '#ff6a1f', job: 'you are doing something', use: 'typing, asking, listening — the live edge' },
      { hex: '#1b998b', job: 'the system is alive', use: 'status dot at rest, the name, standing by' },
      { hex: '#ff9b71', job: 'trouble', use: 'refused, unsupported, lost' },
    ] },
    { group: 'Copy', items: [
      { hex: '#98978f', job: 'quiet words', use: 'helper copy, idle status, the request pill' },
      { hex: '#eaefd3', job: 'words', use: 'anything you typed or the tool said' },
    ] },
    { group: 'Surface', items: [
      { hex: '#241f27', job: 'the ground', use: 'the canvas everything sits on' },
      { hex: '#352c3c', job: 'the field', use: 'the composer and the grip plate' },
      { hex: '#3f3547', job: 'edges', use: 'the bar rule, the grip edge, the dot grid' },
      { hex: '#4f4459', job: 'edges, one step up', use: 'borders that must be seen: answers, tags' },
    ] },
  ],
  values: [],
  embeddable: true,
  status: 'draft',
  // Square: the story is one grip and one field, and a tall frame was empty canvas on every device.
  stage: { w: 1080, h: 1080 },
  fluidMin: 0, // one grip and one field lay themselves out at any width; scaling would shrink the tap target
  height: 460, // a grip and a field: the canvas below them is texture, not a room to fill
}
