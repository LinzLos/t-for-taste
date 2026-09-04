import type { EpisodeMeta } from '../types'

export const meta: EpisodeMeta = {
  number: 1,
  slug: 'live-session',
  title: 'What it can actually do',
  material: 'a composer that shows its hand',
  library: 'motion',
  caption: {
    default: 'A prompt box takes anything you type and finds out later whether it can do it.',
    change: 'The options are drawn from what is actually connected. They filter as you type, and one travels into the field when you take it.',
    reason: 'Most people animate the send. Everything else is where the craft is.',
  },
  values: [
    { label: 'Offered', value: 'rise 8px + fade, 180ms, 12ms stagger' },
    { label: 'Leaving', value: 'fade + scale 0.92, 140ms ease-in' },
    { label: 'Reflow', value: '200ms, survivors move rather than re-render' },
    { label: 'Travel', value: 'chip → token, 320ms, small overshoot on landing' },
    { label: 'Growth', value: '1 → 5 lines, never eased' },
    { label: 'Empty', value: 'help arrives 220ms after the last chip leaves' },
    { label: 'Reduced motion', value: 'no stagger, no travel, no reflow' },
  ],
  embeddable: true,
  status: 'draft',
}
