import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'crumble',
  title: 'The button that ends it',
  material: 'plaster',
  library: 'gsap',
  caption: {
    default: 'A destructive action gets a red button and a confirm dialog.',
    change: 'One button. Press it and the whole interface cracks, sags, and falls off the wall.',
    reason: 'Some exits deserve to feel like one.',
  },
  values: [
    { label: 'Press', value: '3px sink, 80ms' },
    { label: 'Cracks', value: '7 paths from the button, drawn 620ms, 40ms stagger, power1.inOut' },
    { label: 'Sag', value: '−2.4° about the nail, 320ms, power3.out, overlapping the cracks by 200ms' },
    { label: 'Hang', value: '180ms of nothing before it goes' },
    { label: 'Shards', value: '7 × 9 jittered lattice, 38% jitter, clip-path polygons' },
    { label: 'Fall', value: '0.95–1.35s, power2.in, ±70° spin, 12ms stagger ordered by distance from the button' },
    { label: 'Ghost', value: 'the unfaded rectangle and one nail, 600ms after the first shard' },
    { label: 'Reduced motion', value: 'panel fades 200ms, ghost remains, nothing falls' },
  ],
  embeddable: true,
  status: 'draft',
}
