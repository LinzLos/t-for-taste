# T/01 — crumble — build log

## 01-scaffold-index.png
**Who:** agent, from Lindsay's brief.
**What:** the series index. Paper ground, one mono face, heavy rules, no cards.
**Why:** the chassis had to be un-shadcn before any episode existed, or every episode would inherit the wrong defaults.

## 02-first-visual-record.png
**Who:** agent. First visual of the episode, about 90 minutes after the scaffold.
**What:** plaster wall, a panel hung on one nail, Impact display face, ink rules, one hot orange button.
**Why:** the material is plaster, so the panel is a plaster slab, not a card. Impact and orange are the "one uncomfortable colour" rule.
**Decisions the agent made that Lindsay has not yet touched:** the panel copy, the panel proportions, the button label, every number in the meta values.

## 03-first-visual-frame.png
**Who:** agent.
**What:** the same state inside the frame, with the caption and the motion toggle.
**Why:** the caption is part of the episode. Default, change, reason, and the actual values, every time.

## Concept shift (2026-09-02, Lindsay)
The button is not an exit. It's a **dynamic state triggered by rage clicking**: N presses inside a window, then the interface reacts.
"Some days are better than others." The crumble becomes what happens when the threshold is crossed.
Open design parameters, Lindsay's call in Figma: click count, time window, whether the threshold decays, and what the pre-threshold presses do.

## Next entries
Lindsay takes this build into Figma to handle taste, then brings the values back. Entries from here on are hers.

## Concept v2 (2026-09-02, Lindsay, verbal; she will spec it further)
Not a shatter. A **melt**. Material changes from plaster to something that slumps: the UI slides and drips off the bottom of the screen, "the blob", components sliding down.
The scene is a **modern AI builder screen**, not a campaign control panel. The story in beats:
1. A **cursor** (the user's) is trying to do something in the builder. Attempts repeat and **accelerate** into a rage click.
2. The acceleration crosses a threshold and a **state change** appears on a button **at the top** of the screen: "fuck this shit."
3. The user presses it. The UI **melts away** toward the bottom.
4. Underneath: something AI-like, a **builder ready to start again**. Clean slate.
Tone: funny, not friction-y. The button is relief, not punishment.

Implications for the build (agent notes, not decisions):
- The cursor is a scripted actor, not the real pointer. It gets its own easing curve, and the acceleration IS the rage-click parameter made visible.
- Melt is a per-component timeline (order, sag, stretch, detach, drip), so the layout of the fake builder decides the choreography. Design the builder with the melt order in mind.
- "Ready to start again" needs one honest affordance underneath, not a second UI. Probably a single prompt field and a blinking caret.
- Reduced-motion twin: the state change still happens; the melt becomes a fade; the clean slate still arrives.
- Filename/slug stays `01-crumble` until the spec is final, then rename to match the material.

## Figma spec, first pass (2026-09-02, agent from Lindsay's verbal brief)
**File:** https://www.figma.com/design/bHwmwtxOx3rm97VfoluIpg/t-for-taste
**Who:** agent built the frames; Lindsay named the project ("some days are better than others") and set the concept.
**What:** a `T/01 builder` variable collection (10 colours, dark), four components (Chip, Top button with publish/rage variants, Cursor, Node with done/running/queued/error variants), and four 1080×1350 state frames: 01 calm, 02 threshold, 03 pressed, 04 reveal.
**Why these choices, all open to Lindsay:** Space Grotesk + JetBrains Mono + Bricolage Grotesque ExtraBold (no Inter, no Geist). Acid lime for "alive", the same hot orange as the plaster build for the threshold, so T/01 keeps one uncomfortable colour across both builds. The builder is a node-canvas workflow tool, not a chat app, so the melt has parts. The prompt log escalates in words while the cursor trail tightens toward Regenerate, which is the acceleration made visible. The top button is the only primary action, so its state change is unmistakable. The reveal is one field and a caret, nothing else.
**Agent decisions Lindsay has not touched:** every colour value, the fonts, node copy, the four log lines, drip placement in 03, the "ready" chip in 04.

## Palette pass (2026-09-02, Lindsay)
**Who:** Lindsay chose six colours and dropped them as labelled swatches in the Components section. Agent mapped them onto the existing tokens so components and frames updated through the bindings.
**Her colours → tokens:** #220633 → bg/canvas, #241f27 → bg/panel, #352c3c → bg/field (the three stacked "elevation surface" swatches, back to front); #1b998b → accent/live (was acid lime, renamed); #eaefd3 → ink/primary; #ff9b71 → danger/hot.
**Agent-derived, flagged for her:** ink/muted #98978f, line/default #3f3547, line/strong #4f4459 (mixes of her ink and field), and danger/on set to her deep purple #220633 because cream text on salmon fails contrast.
**Why it matters:** the acid lime and hot orange were the agent's "one uncomfortable colour" guess. Her palette is warmer and darker, aubergine instead of near-black, and the threshold colour is salmon rather than hot orange. The taste call on the whole feel of T/01 is now hers.

## Copy pass (2026-09-02, Lindsay's source, agent's rewrite)
**Source:** Lindsay's "Seeing what changed" Inkeep design challenge (`~/Dev/active/open-knowledge/seeing-what-changed/`): TulipTech, a Dutch bulb-pricing company; Marike, the user who returns to find the agent rewrote her 60-word pricing paragraph into one sentence. The highest-ranked change class in that work was "overwrote your writing". That is now the joke's engine.
**Not word for word.** Borrowed the world (tuliptech-docs, billing-and-invoices.md, Pricing tiers, the Preferred tier, 9:15) and the shape of the system line ("60 words became one sentence"). New lines written for the builder.
**What changed in the frames:** a `tuliptech-docs` chip; nodes are Doc saved → Rewrite ("Tighten the pricing intro") → Notify Marike (Slack · #billing), plus Regenerate ("Retry the rewrite"). Calm log: "tighten the pricing intro" / rewrote Pricing tiers · 60 words → 1 sentence / "no. keep my paragraph, tighten the table notes." / same system line. Threshold adds: "KEEP. MY. PARAGRAPH." / …· Preferred tier removed / "I WROTE THAT AT 9:15". Composer reads "Marike, what should change?"; the reveal field reads "Start again, Marike."
**Kept:** the project name "some days are better than others" (Lindsay's) stays in the top bar.
