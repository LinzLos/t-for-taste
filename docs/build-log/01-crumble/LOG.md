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

## Scope note (2026-09-02, Lindsay)
Today's type decisions apply to the **episode** only: Fredoka for the product, Courier Prime for its system voice. The wrapper site ("chassis") gets its own separate pass later. Literata is deployed there as a placeholder, not a decision.

## Publish button: shadow swish (2026-09-02, Lindsay's spec)
**Her call:** no typical button background or stroke. The label alone, and the hard offset shadow is the affordance. Default sits below; hover swishes it to the right; press tucks it in.
**Values (agent's first pass, hers to tune):** shadow = teal accent, hard-edged (blur 0). Rest offset (0, 6). Hover offset (14, 0), 220ms, power3.out. Press offset (3, 2), 80ms. Release returns to hover if still hovered, else to rest, 180ms. Cream text over a teal offset copy reads like misregistered print.
**Figma:** Top button set now has state=publish, publish-hover, publish-press, rage. Description on the set carries the timings.
**Reduced motion:** the three offsets still apply as static states; no tween.

## Publish button, Lindsay's version (2026-09-02)
**Who:** Lindsay drew the two states herself in Figma ("Top button default state" and the hover frame, now labelled as source). Her geometry is subtler than the agent's first pass: rest shadow (0,3) teal, hover nudged to (2,3), Fredoka SemiBold 28, no visible bg or stroke.
**Reconciled spec:** rest (0,3) · hover (4,3) reached with an OVERSHOOT easing so the shadow swishes past to ~(8,3) and settles, 260ms, `cubic-bezier(.2,1.6,.4,1)` · press (1,2), 80ms · release to hover 180ms. The swish is in the easing, not the distance.
**Code:** `filter: drop-shadow()` can't be tweened with overshoot cleanly across browsers; implement the shadow as a second copy of the label (`::after`, teal, `aria-hidden`) translated by (x,y), and tween `transform` with the cubic-bezier. That keeps it GPU-cheap and interruptible.
**Housekeeping:** a stray teal "Rectangle 1" (14:252) sits at page level near her frames; left alone, hers to delete.

## First code pass of the story (2026-09-02, Lindsay: "get the story part up on localhost")
**Who:** agent, from the Figma frames and the decisions above. The plaster crumble stub is retired; the episode folder is now `src/episodes/01-some-days/` (slug `some-days`, route `/#/01`). This log folder keeps its name for history.
**What runs:** the four beats inside the stage. `story.ts` holds the copy as data (nodes, log, review, rage parameters). Calm → rage-click Reconnect (5 presses inside 1.5s) → threshold → press the button → placeholder melt (cards soften to 48 then slide off, log drops) → review. ← / → step beats for recording. Publish is live CSS: label plus a teal `::after` copy, rest (0,3), hover (4,3) with the overshoot easing, press (1,2). Radius-as-state is CSS: soft 48 dashed, trying breathes 32→8, stuck jitters 0↔8 in hot. Reduced-motion twin: no breathing, no jitter, no melt tween.
**Not yet:** the scripted cursor, live typing in the composer, the real melt choreography, dust and drips. Those wait on Lindsay's Figma pass for 03.
**How to test:** `http://localhost:5180/t-for-taste/#/01` (chassis) or `…/#/01?record` (stage only). Hover and press Publish. Rage-click Reconnect. Press the button. Arrow keys step.

## Chassis rules: hot pink (2026-09-02, Lindsay)
All chassis rules (`--rule`) go from ink black to **#ff2fa6**, the Penguin hot pink from the Pelham palette. Index list lines, frame bar border, stage outline, caption divider, values table lines, motion toggle border. A first mark of her wrapper pass, made ahead of it.

## The rolling period (2026-09-02, Lindsay's spec)
**Her ask:** a period after "Taste" that rolls in like a ball on page load, with a small delay, deliberate and assertive rather than eye-blink fast, may extend past and snap back into place.
**Built (chassis index, `motion/react`):** the dot is a separate span in the rule pink. 0.5s delay so the title lands first. Then 1.25s: x from 58vw to −0.22em (overshoot into the word) with `circOut`, then to 0 with an overshoot curve `[.34,1.56,.64,1]` so the snap-back has a tiny wobble. Squash and stretch ride along: scaleX 1.25 → 0.82 → 1, scaleY 0.8 → 1.18 → 1, origin near the baseline so it lands on its foot. The h1 clips overflow so the ball enters from the edge, not from outer space.
**Reduced motion:** the dot is simply there.
**Values are the agent's first pass; the delay and the overshoot distance are the two she'll feel first.**

## Rolling period, second pass (2026-09-02, Lindsay: "less eager, more tasteful; the snap back is a less intense attraction")
**Fix:** the clip was on the h1, whose .85 line-height box is shorter than the glyphs, so descenders and the period's foot were cut. The clip moved to a `.title-clip` wrapper with padding for descenders (and matching negative margins so the layout doesn't shift).
**Softer roll:** approach shortened from 58vw to 5.5em; duration 1.5s with a 0.6s delay; deceleration on the standard curve `[.4,0,.2,1]` instead of circOut; overshoot 0.12em instead of 0.22em; the return is a settle on `[.33,1,.68,1]` with no wobble; squash trimmed to 1.1/0.92 → 0.95/1.05 → 1.

## Rolling period, third pass (2026-09-02, Lindsay: "come out of the e, not the right side of the pane")
The dot now starts at x −0.72em (centred on the e) at scale 0.15, sitting BEHIND the text (z-index −1 under a positioned h1), so it is hidden inside the e and emerges as it grows and rolls right. Overshoot 0.14em, settle to 0. 1.4s after a 0.6s delay; same two curves as the second pass. Born from the letter, not delivered from the edge.

## Chassis colour, settled (2026-09-02, Lindsay)
Rules go back to ink black. The period pink (#ff2fa6, now `--pink`) lives on exactly two things: the rolling period and hyperlinks (the episode title in the list, the back link in the frame bar). One accent, one job: pink means "this is the thing that moves or the thing you can click."

## Correction (2026-09-02, Lindsay): link text stays ink; pink is the hover underline only
Link text reverted to ink. On hover, a 2px pink underline offset .2em under the episode title and the back link. So the pink rule is now: the period, and the underline that appears when you hover something clickable.

## Rolling period, fourth pass (2026-09-02, Lindsay: "grow-over-position is not a roll; don't show the dot until it emerges from the e")
**Two mechanisms:**
1. **The gate.** The dot sits inside an inline `overflow: hidden` window that begins exactly at the e's right edge (it is the next inline box after the e). Anything left of the edge is clipped, so the dot is invisible until it physically crosses out of the letter. No z-index tricks, no reliance on the glyph's ink covering it.
2. **A visible roll.** The dot's fill is a radial gradient with an off-centre highlight (background-clip: text), and it rotates by distance ÷ radius, so the turn reads. The ink centre is measured at runtime (canvas `measureText` for the glyph's ink box, a zero-height inline probe for the baseline) and used as the transform origin, so it spins on its own axis rather than wobbling. No scale change: a ball doesn't grow.
**Path:** x from −1.05em (inside the e) to +0.14em overshoot, then back to 0. Rotation ≈ 1.19em ÷ r out, then back by 0.14em ÷ r. Same timing and curves as before (0.6s delay, 1.4s, standard out then settle).
**Reduced motion:** a plain pink period, no gradient, no roll.

## Lede in her voice + spin axis fix (2026-09-02)
**Lede (Lindsay):** the placeholder "One interaction per episode…" read as AI-generated. Replaced with a first draft in her direction: "I build AI products. Here's what I'm exploring: React and TypeScript patterns, each with a twist." Hers to rewrite; it lives in `src/Index.tsx`, `index.html` and the README.
**Spin axis:** the baseline probe measured wrong (61px into a 185px box), so the glyph orbited out of the gate. Baseline now comes from font metrics: half-leading + ascent inside an explicit 1.2 line-height, ink centre from canvas `measureText`.

## Rolling period, fifth pass + Figma frame for her motion layout (2026-09-02)
**Code:** the glyph-measurement approach kept landing the spin axis wrong, so the ball is now its own CSS circle (0.17em, radial highlight) seated on the baseline inside the gate. The gate is an empty inline-block whose bottom edge IS the baseline, width ≈ the period's advance, overflow hidden, left edge at the e's right edge. A visually hidden "." keeps the text reading "Taste." Rotation is distance ÷ radius with r = 0.085em; travel −1.05em → +0.14em → 0. No glyph metrics involved.
**Figma:** new section "Chassis · title motion" with a Ball component (radial highlight so rotation reads) and a 1440×900 "Index hero · 00 rest" frame: Literata title, the Period as a Ball instance seated after the e, the new lede, one episode row, sign-off. Note in the section: duplicate the frame per keyframe (inside the e · emerging · overshoot · settled) and move only the Period.

## The olive (2026-09-02, Lindsay's idea, agent's placement)
**Her idea:** make the period a green olive, martini and cheese-plate energy. **Agent's counsel:** not as the default (it turns a typographic wink into a mascot and breaks the one-accent rule), but as an easter egg. **Her call:** "omg yes the easter egg."
**Built:** once the roll has settled, hovering the period turns it a quarter turn (260ms, settle curve) and fades in an olive layer: green skin, pimento off-centre. Mouse away and it is a period again. It never triggers during the roll, and touch users simply see the period. Reduced motion: colour swap, no turn.

## Chassis fixes + beat strip + the live-session plan (2026-09-02, Lindsay's review of localhost)
**Her notes:** the stage was clipped and the caption sat over it; Publish was too small to see the effect; the chat needs real scrolling; and she had no idea how to move through the story.
**Fixes:** the stage fit used the host's outer box including padding, so it scaled a hair too big and got clipped; it now fits the padded box and the frame rows no longer stretch. Publish is 36px/700 and its shadow offsets are in em (rest .12em, hover .16em/.12em, press .04em/.08em) so the swish survives the half-scale chassis view. The log is a real scroll container pinned to the newest line, scrollbar hidden. **Beat strip:** the episode registers its beats with the chassis (`src/chassis/beats.tsx`); the frame bar shows "1 calm · 2 threshold · 3 pressed · 4 review" as buttons with a hint ("or rage-click Reconnect, 5 times fast" / "or press the button"). Record mode hides it.

## Plan: the live session animation (to build after Lindsay's melt frames)
The recording is one continuous take, driven by a timeline, no clicks by a human. Actors and beats:
1. **Marike types.** Each user line is typed into the composer character by character with a caret, at a human cadence: ~55ms per character with jitter, a pause on punctuation, a longer pause before a caps line. Then Enter: the line commits to the log with a short slide-up, the composer clears.
2. **The system answers after a beat.** 600–900ms of a subtle "thinking" state on the Lotion node (radius breathing), then the system line lands in mono. No typing effect for the machine; it appears whole.
3. **The log scrolls, never grows.** Each commit pushes older lines up with a 220ms ease; the two oldest visible lines fade. Same tempo as the typing so it reads as one motion.
4. **The cursor is an actor.** A scripted pointer moves from the composer to Reconnect. Its clicks accelerate: intervals 900 → 600 → 350 → 200 → 140ms. Each click bumps "try N" and jitters the Lotion card harder. The fifth click inside 1.5s crosses the rage threshold; the top button flips.
5. **Tempo is one curve.** Typing cadence, cursor click intervals and the caps escalation all read from the same easing so the rage feels like one person losing patience, not three effects.
6. **The press.** Cursor travels to the button, pauses 300ms, presses. Melt per Lindsay's Figma frames. Review lands.
7. **Length target:** 26–30s. Calm 8s, escalation 10s, press and melt 4s, review 6s.
Implementation: one GSAP master timeline with labels per beat; typing via a custom tween on a character index; cursor via motion path; the rage detector stays real (the scripted clicks go through the same code path as a human's).
**Follow-up:** the builder's generic `button` reset outranked the styled buttons (specificity), so Publish rendered at body size. Styled buttons are now scoped `.builder .publish` etc.

## The hatch grows where the rage is; a cursor actor; a transport row (2026-09-02, Lindsay's notes on localhost)
**Her notes:** the escape hatch must not be a state of Publish; show a cursor so viewers see what is being clicked; the header is clumsy and the button shouldn't be up there; the story must work when she interacts with it.
**Built:**
- **Publish stays Publish.** The "FUCK THIS SHIT." button now rises out of the Reconnect card at the threshold (hatch animation: 320ms, overshoot curve, scaleY from .2 at the card's bottom edge). The escape hatch appears where the anger is.
- **Cursor actor.** A play button runs the story: the pointer fades in at the composer, travels to Reconnect (0.9s), clicks six times with gaps 0.7 / 0.45 / 0.3 / 0.2 / 0.15s (the sixth crosses 5-in-1.5s through the real rage detector), travels to the hatch, pauses, presses. Manual clicks work at any point and the two share one code path. Record mode auto-plays after 0.8s (`?record&hold` to stop that).
- **Transport row** under the stage: ▶ play, the four beats, the hint, the motion toggle. The frame bar is back to the series name and the episode title. Record mode hides the transport.

## Attempts you can see; the offer instead of the scream (2026-09-02, Lindsay's notes)
**Her notes:** one tap on Reconnect should visibly do something; the hatch arrived abruptly, "like screaming", and did not present as an option. It should read as "had enough? want to do this?" with the system offering to tell you what went on (a debrief-ish thing, not the words forensics or audit).
**Built:**
- **Each Reconnect tap is an attempt.** The Lotion card flips to hot "reconnecting · try N" for 650ms, the try count bumps, and the system writes "Reconnected, try N. Found 0." into the log. The loop is visible before the rage.
- **The offer.** At the threshold the system speaks in the log, where it has been speaking all along: a calm panel slides up (420ms, standard curve). "Had enough?" · "Six tries, same answer. Want the rundown of what actually happened while you clicked?" · secondary "Keep trying" (back to calm) · primary teal "Fuck this, show me" (→ melt → review). Lowercase, deadpan, one accent. No button on the canvas, none in the top bar.
- **The name:** "the rundown." Alternatives in the same register: debrief, replay, the receipts, retrace.
- **Cursor:** autoplay now measures the offer's primary button live (in stage coordinates at any scale) and presses it.

## Live connectors (2026-09-02, Lindsay: "the connectors don't work, it doesn't feel real")
**Built:** edges carry the state of the node they leave. Out of a listening card: teal marching dash (1.1s loop) and, every 2.4s, a pulse that leaves Lotion, reaches ~42% of the way to Summarize and fizzles. Nothing arrives; that is the story drawn on the wire. Every Reconnect tap fires the same pulse, hot. At the threshold the edge goes hot and the marching stops. Edges out of soft cards stay dim and dashed, since nothing has ever flowed there. GSAP MotionPathPlugin (free) moves the pulse along the real path. Reduced motion: no march, no pulses.
**Connector bug found and fixed:** endpoints were measured in screen pixels while the SVG draws in stage units, so at any scale other than 1 the edges landed small and behind the cards (that is why the first pass, at full scale, looked fine and every chassis view since did not). Measurements now divide by the stage scale.

## Note for later (2026-09-02, Lindsay)
The **caption section** (Default / Change / Reason, the values table, the meta line) will get its own pass: content and design both. Nothing there is final.

## Three cards, not four (2026-09-02, Lindsay: social size limit; three is better balanced and gives more room)
**Dropped:** Tell Marike. It was downstream of Summarize and the review never named it. **Kept:** Lotion (listening), Summarize (waiting), Reconnect (the thing being hammered). Reconnect now hangs off Lotion with the dashed edge, which is where a retry belongs. Positions in the 1008×800 canvas: Lotion (60,60), Summarize (580,230), Reconnect (300,500). Same in the Figma frames 01–03, connectors redrawn, cursor and trail moved.

## Two notes (2026-09-02, Lindsay)
**Story principle, in her words paraphrased:** we may "cheat" on the story for legibility, but reassess; balance legibility with rigor and sharp design judgment. Working test: cheating is fine when it removes something the viewer would have to hold in their head, not fine when it removes something the review depends on. Three cards passed. Anything further gets the same question.
**Period gate bug:** the reveal window was .3em wide; the ball at .06em + .17em plus the .14em overshoot reached .37em, so the mask clipped it at the most visible moment. Gate is now .6em wide with a −.3em right margin, so the layout keeps the period's advance and the overshoot has room.

## Across devices (2026-09-02, Lindsay: "is it going to look beautiful on phone, MacBook Air, iPad, big studio?")
**Checked:** phone 375, tablet 768×1024, laptop 1440×900, display 2560×1440. Tablet and laptop fine. Display: the stage caps at full size (0.99) and the chassis type stays small in a lot of paper; a wrapper-pass question, not a bug. Phone had two real faults: the episode row squeezed the title to one word per line, and the frame page overflowed sideways because the values table is as wide as its longest line.
**Fixed:** under 600px the episode row stacks (number + title, then meta); the values table is fixed-layout, full width, wrapping; frame bar, transport and caption tighten; the stage host stops reserving viewport height; the document can never scroll sideways.
**Known on touch:** the Publish swish and the olive are hover-only, so phones don't see them. Rage-click and the offer work with taps. If the phone matters for the episode itself, both need a tap fallback.
**Phone follow-up:** the stage stayed at half scale on a 375px screen because the fit was circular: the stage's own width propped the grid column open, so the host measured itself as wide as the stage. The frame column is now `minmax(0, 1fr)` and the host has `min-width: 0`, so the column is the viewport and the fit converges. (The earlier headless phone captures were misleading: desktop Chrome has a minimum window width, so a 375px window still laid out wider. Real emulation in the pane is the reliable phone check.)
**Verified on phone emulation:** stage 351px wide at scale 0.325, fully inside a 375px viewport; index and frame both fit; transport wraps; caption stacks.
**Design finding from the phone check:** at phone width the 1080-wide stage renders at about a third, and a LinkedIn feed on a phone is the same ~360px. Node titles (30px in stage units) become ~10px on screen. For social legibility the type INSIDE the stage should be sized for one-third viewing: titles ≥ 48, body ≥ 34, pills ≥ 30, log lines ≥ 34 (stage units). This is the same pressure that argued for three cards. Queue a "social legibility" type pass on the builder before recording.

## Two notes (2026-09-02, Lindsay)
- "Ship fast, laugh last." is upright now; she didn't like the italic.
- **Tap fallbacks on mobile:** tapping the word "Taste" toggles the olive (the dot is too small to tap on a phone; hover on the dot still works on desktop). Tapping Publish plays the swish (adds a `swished` class for 340ms, same transform as hover), then the press tuck and the return happen as normal.

## Footer + lede (2026-09-02, Lindsay)
**Footer, on the index and every episode page:** "Ship fast, laugh last." upright · **ZUNIGO** in Monofett (the mark her portfolio footer uses), linking to zunigo.net, pink underline on hover · "♥ 2026" in mono. Monofett self-hosted via fontsource.
**Lede, second draft:** she questioned "I build AI products" (over-claims, says nothing about taste). Now: "Design engineer. Small React and TypeScript builds about how AI products should feel, one call at a time." Hers to sharpen.
**Lede, third draft (her title dilemma: design engineer vs product designer):** no title in the lede. The series demonstrates; the portfolio declares (design engineer, decided 27 Aug), and the footer mark links there. Now: "Small React and TypeScript builds about how AI products should feel, one call at a time."
