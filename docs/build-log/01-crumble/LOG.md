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
