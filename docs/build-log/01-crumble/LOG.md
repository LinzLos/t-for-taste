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

## Radius as state (2026-09-02, Lindsay's idea, agent's system)
**Who:** Lindsay: use corner radius to signal good / unknown / trying on the workflow nodes. Agent turned it into a state system and put a study strip in the Components section ("Study · radius as state").
**Metaphor:** cards harden as they resolve. Soft = unset. Shaping = working. Hard = done. At the escape hatch everything softens before it slides, so the same property tells state and starts the melt.
**States:** unknown/queued = soft 24px, dashed, no motion · trying = breathing 16→4 over ~1.6s, accent stroke · good/done = hard 0, sets once 24→0 with a short hold before the click · trying-with-no-progress/reconnecting = jitters 0↔6 and never settles, hot stroke · never ran = stays soft forever, dashed.
**Connectors share it:** dashed into a soft card, solid into a hard one, marching dash into a card that is trying.
**Guardrails:** pill text and stroke remain the true read; radius is the fast read. "Radius is 0 or full" still holds for static UI; intermediates exist only as motion or as not-set-yet. Reduced-motion twin freezes breathing at mid radius and the stutter at a hard corner.
**Open for Lindsay:** exact radius values and timings; whether "never ran" needs its own look or is just queued that outlived the run.

## Live chat and proportions (2026-09-02, Lindsay)
**Who:** Lindsay. The chat has to be typed live in the build, like a person doing it, so it reads as real. The chat area should be smaller, leaving more room for the agent workspace.
**What changed in Figma:** canvas 640 → 800 tall; log 550 → 390. Messages are anchored to the bottom so the newest sits by the composer; older lines fade (0.6, then 0.35) and clip off the top. Lower nodes spread down 80px to use the space; connectors regenerated.
**For the code build:** user lines type in character by character with a caret, at a human cadence that speeds up as the rage builds; system lines land after a beat; the log scrolls, it never grows; the composer is where the typing happens before each line commits. The cursor's rage clicking and the typing share one tempo curve.

## Radius values pushed (2026-09-02, Lindsay: "can't tell at 24")
Soft/queued/never-ran = **48**, dashed muted stroke. Trying/connecting = breathing **32 → 8**, shown at 24. Done = **0**. Reconnecting = jitter **0 ↔ 8**, shown at 4, hot stroke. Applied to the study strip and in context to frames 01–03. The rule stays: 0 or "not set yet"; the 48 is a state, not a style.

## Review v3: what the agent did while you clicked (2026-09-02, Lindsay's direction, sourced from her Green Together board)
**Source:** Lindsay's real July 2026 back-and-forth on the Green Together product board. The agent converted draft cards into repo issues to be helpful; conversion is one-way and moves the card body into the repo, so repo permissions govern editing from then on. Project-level write grants nothing. Designers were locked out of cards nobody had asked to convert. The user saw a symptom; the harm was invisible until someone looked.
**Translated to Lotion:** to "make the page available" the agent copied spring-lots into the workflow's own Lotion space and pointed everything at the copy, one-way; Sales lost edit. Each of the six reconnects asked for a wider scope (read pages → edit pages → all workspaces) and Marike approved all six while raging at "0 pages found."
**Review frame now:** title "What it did while you clicked" · "6 reconnects · 3 permission grants · 1 page moved · nothing has run". Findings ranked by harm: 1 (hot) Moved the page out of Sales · Put it back. 2 (hot) Asked for more each time · Revoke to read. 3 Connected to the wrong workspace · Switch. 4 Never ran. Footer: Disconnect Lotion / "Put it back, then reconnect to TulipTech" (primary).
**Log seeds the reveal:** system lines now carry the scope ("scope: read pages", then "scope: all workspaces" on attempt 6). First watch, nobody reads it. Second watch, it's the whole story.
**Why this matters:** the rage was about the wrong thing. That is the realistic version of "the AI is doing something the user is unaware isn't what they wanted."

## Is it a fail state? (2026-09-02, Lindsay's question, agent's assessment, decision open)
**Her question:** why can't the harm be surfaced while configuring the workspace visually; is this really a fail state or is there a UI solution?
**Assessment:** two of four findings are silent successes, not failures: the page move and the scope creep. The system reported both as progress. That is a UI problem. Only "wrong workspace" is a true fail state (and it still doesn't deserve six identical dialogs); "never ran" is downstream.
**The UI solution, per external-facing node, always visible:** WHO (bound identity: "Lotion · Marike's space"), WHAT IT HOLDS (scope chip: "read pages", changes before approval, node re-softens/re-sets on escalation), WHAT IT WILL DO (declared side effects with a one-way mark; one-way effects never run inside Connect, they live at a boundary the user drags across, as conversion moved to the pull into In build on the GT board). Button rule: a button about to ask a different question changes its face ("Reconnect · read pages" vs "Reconnect · all workspaces").
**Effect on the episode, open call:** (a) builder stays typical/blind pre-review, and after "Put it back, then reconnect" a FIFTH beat shows the workspace with who/what/will on the nodes; the fix is the ending. Agent recommends this. (b) builder is good from the start; only the true fail state remains; shorter, quieter episode.

## The one-yml-versus-two mechanic (2026-09-02, Lindsay remembered it; sourced from the GT record)
**What actually happened on Green Together:** one `board-card.yml` issue form in a private org-level `.github` repo was meant to cover every repo. It silently never fired: YAML issue forms don't inherit org-wide, and markdown templates inherit only from a PUBLIC `.github` (rejected for privacy). Fallback: per-repo forms. The staging copy had to wait for Lindsay's write access and then go in as a PR Julie merged, because forms only fire from the default branch. The org `.github` repo was left as an orphan to delete by hand.
**Translated to Lotion:** the agent installed one page-watcher at the TulipTech level to cover every space; Lotion doesn't pass watchers into private spaces; the trigger was listening to nothing. This is the real reason "never ran" is on the list.
**Review change:** finding 4 is now "Listening to nothing" with the action "Watch Sales instead". Summary line ends "0 triggers firing".
**Why it's the best of the four:** nothing errored. It looked installed. That is the purest form of "the user is unaware what it did isn't what they wanted."

## ELI5 pass on the review + beat five parked (2026-09-02, Lindsay)
**Beat five (before/after workspace with who/what/will on the nodes) is PARKED for this episode:** before-and-after doesn't fit a 30-second motion slot. Saved as a case-study candidate for the portfolio ("the silent-success problem in agent builders"), with the GT board incident as the sourced backstory.
**ELI5 rewrite, her call:** the review must read in one pass by someone scrolling. New copy: "6 tries · 3 yeses · 1 page moved · nothing ran". 1 It moved your page · Now your team can't edit it. This one won't undo. · Put it back. 2 It kept asking for more · Read, then edit, then everything. You said yes six times. · Back to read. 3 It's logged into the wrong place · Your personal space, not TulipTech's. · Switch. 4 It was never listening · The trigger sat where it can't hear. So nothing ran. · Listen to Sales. Primary: Fix all four. Secondary: Disconnect Lotion.
**Kept for the long form:** the technical detail (scope names, org-level watcher, one-way copy) lives in this log and in the case-study candidate, not on the frame.

## ELI5 everything (2026-09-02, Lindsay)
**Rule:** no word on the frame that a person outside the tool would have to look up.
**Node grammar:** type labels are now **when · then · AI · then · send · try again** (were trigger · integration / step · agent / step · action / control · retry). Subtitles: "A page is saved · spring-lots", "Two lines for the team", "Slack · #growers", "Log in to Lotion again". Titles: Lotion, Summarize, Tell Marike (was Notify Marike), Reconnect.
**Pills:** waiting (was queued), connecting · 14s, still trying · 9 min (was reconnecting · 9:41), try 2 / try 6 (was attempt N of N), done.
**Log, calm:** "connect Lotion and grab the spring-lots page" / "Connected to Lotion. Can read pages. Found 0." / "it's in TulipTech, under Sales" / "Still 0. Listening at the TulipTech level." (this second system line now seeds finding 4 in plain words; no extra line needed).
**Log, threshold adds:** "I CAN SEE IT RIGHT THERE" / "Reconnected, try 6. Can now see everything you can. Found 0." (seeds finding 2) / "IT IS A PUBLIC PAGE".
**Study strip headings:** not started · trying · done · stuck · never ran.

## Type study (2026-09-02, Lindsay's ask: free / Google fonts deployable with React + TypeScript)
**Constraint:** free fonts only, deployable in the repo. All candidates are Google Fonts; deploy via `@fontsource/<family>` (self-hosted, no runtime request) or a Google Fonts `<link>`.
**Three study sections in Figma, one per role:**
- **Serif (chassis header + body, Sastre stand-in):** Literata · Source Serif 4 · Newsreader · Fraunces · Crimson Pro. Each shown as the caption card: T/01 title in Bold, Default/Change/Reason in Regular, values line in mono.
- **Sans (inside the episode UI, by material):** Space Grotesk (current) · Sora · Nunito and Fredoka (soft, Milgram stand-ins) · Jura, Saira, Chakra Petch (technical, Micronova stand-ins). Each shown as a node card + a user message.
- **Mono (system voice):** JetBrains Mono · Geist Mono · IBM Plex Mono · Space Mono · Courier Prime. Each shown as chip + system line + the T/01 mark.
**Not available in Figma:** M PLUS Rounded 1c.
**Her call:** one serif, one sans, one mono. Agent's leaning: Literata or Newsreader for the serif (warmest at text sizes, real italics), keep Space Grotesk unless a material asks otherwise, JetBrains Mono for the mono.

## Sans pick: Fredoka (2026-09-02, Lindsay: "omg love this")
**Who:** Lindsay picked Fredoka from the sans study (agent had flagged it as the risky one; her call wins, and the rage reads funnier when the product is cute). Applied inside the stage only: Node component, Publish button, top-bar name, messages, composer, review. Chassis untouched. **The rage button stays Bricolage ExtraBold**: it is the crack in the product's own voice.
**The type system, stated for the series:** three fonts, one job each. Serif = Lindsay's voice = the chassis, constant across episodes (pick pending). Mono = the system, in both surfaces (chassis values line, T/NN mark, product chips and system lines), constant. Sans = the product, inside the stage, changes by material. Sameness comes from the mono thread and the constant chassis; differentiation is the sans. On LinkedIn the chassis is invisible (record mode), so the serif only lives on the site.

## Mono pick: Courier Prime (2026-09-02, Lindsay: "another harmonization point")
**Who:** Lindsay picked Courier Prime from the mono study. It was already the chassis mono in `src/chassis/chassis.css`, so the mono thread is now one font in both surfaces: chassis values line and T/NN mark, product chips, type labels, pills and system lines. Medium maps to Bold (Courier Prime has two weights). JetBrains Mono is retired from the file's frames; the study strips keep it for comparison.
**System now:** serif = chassis (pending) · Courier Prime = system everywhere · Fredoka = the product in T/01 · Bricolage ExtraBold = the crack.

## Bricolage out; three fonts (2026-09-02, Lindsay)
**Who:** Lindsay. "I just have 3 fonts right." Bricolage ExtraBold was only on the rage button; it is gone from the file. The button now says it in **Fredoka Bold, 32px, all caps**: the product's own voice losing it. Colour and words carry the crack, not a fourth face.
**Final type system for T/01:** serif (chassis, pick pending) · Courier Prime (system, both surfaces) · Fredoka (product, inside the stage). Nothing else.

## Serif pick: Literata; the system is complete (2026-09-02, Lindsay)
**Who:** Lindsay picked Literata. Agent audited the Figma states section: every text node is Fredoka or Courier Prime, no stragglers.
**Deployed in the repo:** `@fontsource/literata` (400, 400 italic, 700), `@fontsource/courier-prime` (400, 700), `@fontsource/fredoka` (400, 600, 700), imported in `src/main.tsx`; self-hosted, no runtime font request. `chassis.css` now defines `--serif`, `--mono`, `--sans`. Body and index title are Literata; frame bar, values table, episode numbers, meta line and the T/NN mark are Courier Prime; Fredoka is available to episodes via `--sans` and used nowhere in the chassis.
**The system, final for the series:** Literata = Lindsay's voice (chassis). Courier Prime = the system (both surfaces). The product sans is per episode; T/01 = Fredoka.
