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

## 8 · The handle: grid for typing, face for voice

**Decided (Lindsay):** the affordance matches the modality. A grip is for something you drag; a face is for something you talk to.

| Mode | Handle |
|---|---|
| Rest | grip dots, muted |
| Typing | grip dots, orange. **No face.** |
| Voice | the dots become a face |

Consequence: the authoring episode never needs the face, because its whole path is typing. The face is a later flourish, not a blocker, and the dot arrangement stays open.

When it is built: the face should be driven by actual input amplitude, not a loop. Listening, not performing. A face that animates on a timer while you are silent is the thing that would break the tool-not-a-person rule; one that moves because you are moving air does not.

---

## Reduced motion

No stagger, no travel, no reflow tween. Chips appear and disappear. The token lands in place. Growth is unchanged, because it was never animated.

## What this spec is claiming

Most composers animate the send. The craft here is everywhere else: how the options are offered, how they leave, how one travels into the field, and what the emptiness looks like when nothing matches.

---

## Build notes (2026-09-03)

**Typed chips (Lindsay's addition).** Enter on something nothing can do commits it anyway as a `yours` chip: outlined instead of filled, so a built workflow shows at a glance which of its steps are real and which are requests. Committed phrases join the suggestion list, marked as hers, so the set grows from use without ever pretending a request is a capability. The empty state's button is now "Ask for it anyway".

**Handle and field are one shape** (from her frames): at rest the handle carries a bottom edge only; when open the handle takes the top and sides and the field takes the bottom, and only that bottom edge turns orange. Grip dots are ink, not orange.

**Travel is measured, not shared-layout.** A `layoutId` shared between the chip and the token makes motion run a shared-layout transition and an exit animation on the same element, and the chip gets stuck. The token now measures where the chip stood and animates home from there, which also gives exact control over the landing.

**⚑ Unverified: chip exit and reflow.** Neither of the agent's automated browsers can confirm it. The in-app pane reports itself hidden, so animation frames never fire; headless Chrome with a virtual time budget freezes mid-animation. In both, exiting chips appear stuck, which is an artifact of the harness rather than evidence about the code. **This needs eyes on localhost.** What to look for: type until nothing matches and confirm the chips leave rather than pile up, and that the survivors slide into the gap rather than jumping.

## 9 · Committing

Enter was making newlines, which meant there was no way to commit anything.

| Key | Does |
|---|---|
| `Enter` with text and a match | takes the top match |
| `Enter` with text and no match | commits it as yours |
| `Enter` with nothing typed | builds what you have |
| `Shift` + `Enter` | a new line |

So Enter always means "commit the thing in front of me", which is one rule rather than three. A mono hint under the field names the current meaning as it changes, which also teaches the interaction to a viewer who cannot see the keyboard. The send arrow is the same submit, and it is dim until there is something to build.

On build, a mono line states what was made, and flags in orange if any step is a request rather than a capability.

## 10 · Voice

The mic sits beside send: two ways in, one row. Pressing it turns the grid into a face, per §8.

**The morph uses the same nine dots.** Two stay as eyes and grow slightly, three become a mouth, four fade and shrink. Nothing is swapped out, so it reads as one thing changing rather than one thing replacing another. 260ms on the settle curve.

**The mouth moves because something is being said.** A speech envelope drives the centre dot's vertical offset. In this build the envelope is simulated, because asking for a microphone in a demo is the wrong trade; in a real product it is amplitude. It is deliberately not a loop: the value re-targets at irregular intervals and eases toward it, so it never finds a rhythm.

The placeholder reads "Listening" and the hint becomes "listening · tap the mic to stop". Reduced motion holds the face still.
