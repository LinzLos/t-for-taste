import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'live-session',
  title: 'It only moves when you do',
  material: 'an LED meter on a grip',
  library: 'motion',
  caption: {
    default: 'A voice button shows a waveform that dances whether or not you are saying anything.',
    change: 'The grip listens through the microphone and nothing else. Press it and it goes orange; when the browser says yes it unrolls into a meter, and only your voice moves it.',
    reason: 'A face that performs while you are silent is a tool pretending to be a person. Real sound cannot perform.',
  },
  values: [
    { label: 'Pressed', value: 'mic, dots and status dot go orange, 140ms' },
    { label: 'Unroll', value: '3×3 grip → 9×3 meter, 320ms, each column 4% behind the last' },
    { label: 'Smile', value: 'one quadratic, only the pull point moves, 260ms' },
    { label: 'Ballistics', value: 'attack 20ms, release 260ms, as time constants' },
    { label: 'Peak', value: 'holds 450ms, then falls a row every 120ms' },
    { label: 'Floor', value: 'each band tracks its own quiet level; only what rises above it counts' },
    { label: 'Refused', value: 'salmon; the face never appears' },
    { label: 'Reduced motion', value: 'no unroll tween, the smile snaps' },
  ],
  embeddable: true,
  status: 'draft',
  // Square: the story is one grip and one field, and a tall frame was empty canvas on every device.
  stage: { w: 1080, h: 1080 },
  fluidMin: 0, // one grip and one field lay themselves out at any width; scaling would shrink the tap target
}
