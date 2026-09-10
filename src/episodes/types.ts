// Shape of an episode's meta.ts. Node reads these too (scripts/manifest.ts),
// so keep this file free of React and browser globals.

export type MotionLibrary = 'motion' | 'gsap'

export interface EpisodeMeta {
  /** Episode number, shown as "T no. 1" and used unpadded. Assigned when it publishes, never reserved. */
  number: number
  /** URL slug, matches the folder name minus the number prefix */
  slug: string
  title: string
  /** One line for the episode list: what the exploration is about, in plain words. */
  blurb?: string
  /** The one physical idea the episode commits to: plaster, rubber stamp, film leader… */
  material: string
  /** One library per episode. Never both on the same element. */
  library: MotionLibrary
  /** The three-line caption. Each line is one sentence. */
  caption: {
    default: string
    change: string
    reason: string
    /** What it is not, when honesty needs a fourth line. */
    not?: string
  }
  /** The episode's colours, grouped, each with its one job in plain words. Restraint, shown. */
  palette?: { group: string; items: { hex: string; job: string; use?: string }[] }[]
  /** The actual numbers. This is the "if you're stealing this" block. */
  values: { label: string; value: string }[]
  /** Can the portfolio open this in an iframe, or should it link out? */
  embeddable: boolean
  /** Drafts stay out of episodes.json. Flip to 'live' when it ships. */
  status: 'draft' | 'live'
  /** ISO date the episode went live. */
  published?: string
  /** The social frame for this episode. Defaults to 4:5 (1080×1350); square when the story is short. */
  stage?: { w: number; h: number }
  /** How tall the episode stands on the page, in px. Separate from the recording frame: the page is
   *  read, not filmed, so it is only as tall as the episode needs. The chassis caps it so the caption
   *  below is always cut off in view — that edge is the cue that there is more. */
  height?: number
  /** Body width from which the episode lays itself out fluidly instead of being scaled. Default 1000; 0 = always. */
  fluidMin?: number
}

/** What lands in public/episodes.json. Everything the portfolio card needs, nothing else. */
export interface ManifestEntry extends Omit<EpisodeMeta, 'status'> {
  url: string
  poster: string
}
