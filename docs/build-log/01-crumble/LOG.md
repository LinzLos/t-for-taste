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

## Radius pass (2026-09-02, Lindsay's call)
**Who:** Lindsay caught it: every radius was 6/8/10px, the shadcn fingerprint. Agent applied the fix.
**Rule:** hard corners on everything structural (cards, chips, fields, message bubbles, rail icons). Status pills fully round (999), because a pill is a pill. The top button is a hard-edged slab with a solid 6px offset shadow in canvas purple, like the plaster button. In 03 pressed the shadow collapses and the button drops 6px, so the press is physical.
**Added to the anti-shadcn list:** no 6/8/10px radius family. Radius is either 0 or full.

## Beat 4 changed: review, not reveal (2026-09-02, Lindsay)
**Who:** Lindsay. "Start again" is a dead end; after the escape hatch, route to a review of what went wrong.
**What:** frame 04 is now "04 review". After the melt, the builder shows a What went wrong panel: three findings ranked by harm, each with its own Undo, an "Undo all 7", and one primary action, "Try again, paragraph kept".
1. Overwrote your writing · your 60 words from 9:15 became one sentence, seven times (hot).
2. Removed content · the Preferred tier is gone.
3. Never sent · Notify Marike stayed queued the whole time.
**Why:** this is her Inkeep review pattern (rank by risk to the human, per-change undo, undo-all as the safety net) doing its real job inside the joke. The rage button becomes an entry point to review rather than a reset, which makes it a UX pattern and not just a gag. Chip reads "reviewing".
**Open for Lindsay:** whether the review lives in the canvas area (current) or slides up from the log; whether "Try again, paragraph kept" should pre-fill the composer; the melt's end state now has to reveal a panel, not an empty wall.

## Scenario v3: the integration that connects to the wrong place (2026-09-02, Lindsay's direction, agent's copy)
**Who:** Lindsay: make it Marike setting up a workflow with a faux integration, a play on Notion, and something failing. Agent chose the failure and wrote the lines.
**The faux integration:** **Notation**. (Sillier alternative considered: Lotion.)
**The failure:** Notation connects to Marike's personal workspace instead of TulipTech's. Zero pages found. Every Reconnect reauthorizes the same wrong workspace. Rewrite and Notify Marike never start.
**Frames:** Trigger node is now Notation · "Page saved · billing-and-invoices" (connecting → reconnecting · 9:41). Rewrite is queued throughout. Regenerate became Reconnect · "Reauthorize Notation" (attempt 2 → attempt 6 of 6), the cursor's rage target. Chip: connecting… → still connecting… → reviewing.
**Log:** "connect Notation and pull billing-and-invoices" / Notation connected · 0 pages found / "it's in the TulipTech workspace, Billing folder" / same / "I CAN SEE IT RIGHT THERE" / reauthorizing Notation · attempt 6 · 0 pages found / "IT IS A PUBLIC PAGE".
**Review:** 1 (hot) Connected to the wrong workspace · Switch. 2 Asked you to reauthorize six times · the button never changed the question. 3 Never ran. Footer: Disconnect Notation / Reconnect to TulipTech (primary).
**Why this failure:** it is real, common, and not the agent being dumb; the system asked the wrong question six times. The review's job is to name the question, which is the whole point of the pattern.

## De-referencing pass (2026-09-02, Lindsay's intent: not so referential to the Inkeep challenge)
**What moved away from the challenge:** billing-and-invoices → spring-lots; Rewrite "Tighten the pricing intro" → Summarize "Two lines for the team"; Slack #billing → #growers; the "Billing folder" → "under Sales"; footer "Not sure about any of it?" → "Not the day for this?" (ties to the title). 
**What stays:** TulipTech and Marike, because the world is hers and it is not the challenge's copy. The review pattern's shape (ranked, per-finding action, one primary) stays because it is a pattern, not a quote.

## Two calls (2026-09-02, Lindsay)
**Elevation swap:** cards are now the deep purple (#220633 → bg/panel) and the wall is the aubergine (#241f27 → bg/canvas). Agent's reasoning, which she asked about first: the most saturated colour was on the wall, so cards receded; with the purple on the cards they read as slabs on a wall, which is what the melt needs. Field stays #352c3c. Swatches relabelled.
**The faux Notion is Lotion.** Lindsay: "lotion is funny yes." Replaced everywhere: node title, "Reauthorize Lotion", the log, the review, "Disconnect Lotion".

## Node type labels (2026-09-02, from Lindsay's Gumloop pain points)
**Who:** Lindsay raised three pain points from her own builder use: losing the chat when moving between skill and chat, nav bloat, and an unclear skills / agent / workflow taxonomy. She was unsure whether to address them without making the UI the problem. Agent's call, which she can overturn: the UI in T/01 must stay innocent, so the pain points are not shown as problems; the answers are shown quietly.
**What:** every Node now carries a one-word type label above its title, exposed as a `type` property: trigger · integration, step · agent, step · action, control · retry. The canvas is the workflow, a node is a step, an agent is a kind of step. No diagram.
**Not in T/01:** the "chat that stays" (malleable chat window) is its own episode; the taxonomy explainer belongs in a different series.

## Palette comparison: Pelham mode (2026-09-02, Lindsay asked for a side-by-side)
**Who:** Lindsay loves the David Pelham early-70s Penguin SF cover palette and asked for a duplicate palette option to compare. Agent set it up as a second variable **mode** ("pelham") on the same `T/01 builder` collection, so the tokens stay one source of truth and any frame can flip between "dark" and "pelham".
**Pelham values (agent's translation of the covers):** canvas near-black #0d0a0c, cards dark plum #1c1220, field #2a1a30, ink pale yellow #f5e9a8, accent electric cyan #2bb3d6, threshold hot pink #ff2fa6, danger-on near-black. Spares on the swatch row, unassigned: sunset orange #ff6a1f, deep magenta #8a1a6b.
**Where:** new section "T/01 states · Pelham" below the originals, with clones of all four frames and labelled swatches. The section carries the mode explicitly; the frames inherit it.
**Her call:** which mode ships, or a hybrid (e.g. only salmon → hot pink on the original).

## Palette decision (2026-09-02, Lindsay)
**Ships:** her first palette, the "dark" mode: aubergine wall, deep purple cards, cream ink, teal accent, salmon threshold.
**Kept as discovery:** the "pelham" mode and its section stay in the file as the road not taken. Her words: "I like the palette I came up with first but I like that we have discovery."
**Why it matters for the series:** the post can show the comparison and the choice. That is a taste decision made visible, which is the whole point.
