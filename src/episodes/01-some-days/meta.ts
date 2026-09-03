import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'some-days',
  title: 'Some days are better than others',
  material: 'a cute little builder',
  library: 'gsap',
  caption: {
    default: 'A destructive action gets a red button and a confirm dialog.',
    change: 'Rage-click the thing that keeps failing and the escape hatch appears. Press it, the workspace melts, and you see what the agent did while you clicked.',
    reason: 'Three of the four things it did never errored. They are real.',
  },
  values: [
    { label: 'Rage detector', value: '5 presses inside 1.5s on the same control' },
    { label: 'Soft card', value: 'radius 48, dashed, untouched' },
    { label: 'Trying', value: 'radius breathes 32 → 8, 1.6s' },
    { label: 'Stuck', value: 'radius jitters 0 ↔ 8, never settles, hot' },
    { label: 'Publish', value: 'label + teal shadow (0,3); hover (4,3) with overshoot cubic-bezier(.2,1.6,.4,1) 260ms; press (1,2) 80ms' },
    { label: 'Melt', value: 'placeholder: cards soften to 48 then slide 900px, 1.35s power2.in' },
    { label: 'Reduced motion', value: 'states swap without tweens' },
  ],
  embeddable: true,
  status: 'draft',
}
