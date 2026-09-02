// Shape of an episode's meta.ts. Node reads these too (scripts/manifest.ts),
// so keep this file free of React and browser globals.

export type MotionLibrary = 'motion' | 'gsap'

export interface EpisodeMeta {
  /** Two-digit episode number, e.g. 1 renders as T/01 */
  number: number
  /** URL slug, matches the folder name minus the number prefix */
  slug: string
  title: string
  /** The one physical idea the episode commits to: plaster, rubber stamp, film leader… */
  material: string
  /** One library per episode. Never both on the same element. */
  library: MotionLibrary
  /** The three-line caption. Each line is one sentence. */
  caption: {
    default: string
    change: string
    reason: string
  }
  /** The actual numbers. This is the "if you're stealing this" block. */
  values: { label: string; value: string }[]
  /** Can the portfolio open this in an iframe, or should it link out? */
  embeddable: boolean
  /** Drafts stay out of episodes.json. Flip to 'live' when it ships. */
  status: 'draft' | 'live'
  /** ISO date the episode went live. */
  published?: string
}

/** What lands in public/episodes.json. Everything the portfolio card needs, nothing else. */
export interface ManifestEntry extends Omit<EpisodeMeta, 'status'> {
  url: string
  poster: string
}
