# Build log

Screenshots at key points from first visual to landing, per episode, with a note on who did what.
The point of the series is that taste is a set of decisions. This log is the evidence of where each decision came from.

Convention per episode: `docs/build-log/NN-slug/` holds numbered PNGs and a `LOG.md` with one entry per screenshot.
Each entry says **who** (agent or Lindsay), **what changed**, and **why**, in that order.

Capturing a frame: the agent can screenshot a built copy with headless Chrome. Mid-animation frames come from
`__tl.pause().seek(t)` in the dev console (dev builds only), then a normal screenshot.
