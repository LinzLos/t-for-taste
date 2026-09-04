# Composer states — T/01, the authoring episode

The composer's job in an authoring context: **you type what you want to build, and it shows you what it can actually wire up.** Chips are drawn from real capability, so what isn't offered is information.

Values below are the agent's first pass in stage units (1080 × 1350). Lindsay's to tune; the ones marked ⚑ are the ones that will feel wrong first.

---

## 1 · Rest

One line. Placeholder, no border, no chips. The grab handle sits above with its grip dots, muted.

| | |
|---|---|
| Height | 63 (one line) |
| Border | none |
| Placeholder | "Describe what you want to build" |
| Handle dots | muted, static |

## 2 · Focus, empty

Caret in. The border arrives and the chips are offered.

| | |
|---|---|
| Border | 2px `#ff6a1f`, fades in 120ms |
| Handle dots | orange, and the active state (see §8) |
| Chips | rise 8px and fade in, 180ms each, **⚑ 12ms stagger** |
| Chip set | starters, drawn from what's connected |

The stagger is what makes them read as *offered* rather than *appearing*. Too slow and it's a menu unrolling; too fast and it's a flash.

## 3 · Typing, matching

Chips filter live. This is the state that carries the episode.

| | |
|---|---|
| Leaving chip | fade + scale to 0.92, 140ms, ease-in |
| Remaining chips | reflow into the gap, **⚑ 200ms**, standard ease |
| Match rule | substring on the capability label, not fuzzy — fuzzy is unpredictable on camera |

**The reflow is the craft moment.** Most implementations re-render and the row jumps. Ours moves each surviving chip to its new position. That single behaviour is what a designer watching will notice.

## 4 · Typing, no match

The last chip leaves and the row is empty. In an authoring episode this is informative, not a failure.

| | |
|---|---|
| Empty line | "Nothing connected can do that yet" |
| Offer | one chip: "Connect something" |
| Timing | appears 220ms after the last chip leaves, so the emptiness registers first |

That 220ms pause is deliberate. The gap is the message.

## 5 · Chip selected

The chip **travels** from the row into the field and becomes a token. It does not fade out and fade in somewhere else.

| | |
|---|---|
| Travel | 320ms, ease-out with a small overshoot at the landing |
| Token | pill inside the input, same orange, caret lands after it |
| Row | remaining chips reflow (§3 timing) |

## 6 · Growth

| | |
|---|---|
| Range | 1 → 5 lines, grows downward (composer is top-anchored) |
| Speed | **⚑ instant, or ≤100ms.** Never eased. An eased height makes typing feel laggy. |
| At cap | internal scroll, caret line pinned in view, soft fade on the top edge, never a scrollbar |
| Override | the grab handle drags past the cap and the height is remembered |

## 7 · Submit

Input clears, tokens leave, the thing gets built on the canvas. The hand-off to the connection interaction lives here.

## 8 · The handle's active state ⚑ open

Lindsay's "fun happy face when the user is typing or talking into it". Not yet specified. Options:
- The grip dots rearrange into a face while typing and back to a grid at rest.
- The grid stays and one dot behaves (blinks, drifts).
- The face only appears for voice, and typing keeps the grid.

Needs her call. The risk is cuteness overriding the tool-not-a-person rule; the safest read is that the face is the *product's* branding being cheerful, not the agent claiming feelings.

---

## Reduced motion

No stagger, no travel, no reflow tween. Chips appear and disappear. The token lands in place. Growth is unchanged, because it was never animated.

## What this spec is claiming

Most composers animate the send. The craft here is everywhere else: how the options are offered, how they leave, how one travels into the field, and what the emptiness looks like when nothing matches.
