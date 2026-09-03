# T for Taste

Small React and TypeScript builds about how AI products should feel, one call at a time.

Fresh React + TypeScript builds. Not derived from the portfolio. Not a component library.

## Adding an episode

1. `src/episodes/NN-slug/meta.ts` — number, title, material, library, the three-line caption, the values.
2. `src/episodes/NN-slug/index.tsx` — the interaction. Default export a component. It renders inside a fixed 1080×1350 stage.
3. Register the meta in `src/episodes/registry.ts` and the loader in `src/episodes/index.ts`.
4. Build, tune, record from `/#/NN?record`, drop the poster at `public/posters/NN.png`.
5. Flip `status` to `live`, set `published`, merge to main. Pages deploys and `episodes.json` regenerates. The portfolio picks it up.

## Rules

- One material per episode. Commit to it.
- One motion library per episode, declared in meta. `motion` for interruptible springs and layout. `gsap` for timelines and particles. Never both on the same element.
- Every episode has a reduced-motion twin. Read `useReducedMotion()` from `src/chassis/reduced-motion.tsx` or the `html[data-reduced]` attribute.
- The tell: if it could drop into a SaaS dashboard unchanged, it fails.

## Manifest

`npm run manifest` writes `public/episodes.json` from live episodes. It runs before every build. Override the base URL with `SITE_URL`.

Ship fast, laugh last.
