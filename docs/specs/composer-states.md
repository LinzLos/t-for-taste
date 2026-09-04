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

So Enter always means "commit the thing in front of me", which is one rule rather than three. **No keyboard hint on the surface** (Lindsay, 2026-09-03): instructions on a demo read as a manual, and the interaction has to hold up without being narrated. The behaviour stays; the caption can carry it. The send arrow is the same submit, and it is dim until there is something to build.

On build, a mono line states what was made, and flags in orange if any step is a request rather than a capability.

## 10 · Voice

The mic sits beside send: two ways in, one row. Pressing it turns the grid into a face, per §8.

**The morph uses the same nine dots.** Two stay as eyes and grow slightly, three become a mouth, four fade and shrink. Nothing is swapped out, so it reads as one thing changing rather than one thing replacing another. 260ms on the settle curve.

**The mouth moves because something is being said.** A speech envelope drives the centre dot's vertical offset. In this build the envelope is simulated, because asking for a microphone in a demo is the wrong trade; in a real product it is amplitude. It is deliberately not a loop: the value re-targets at irregular intervals and eases toward it, so it never finds a rhythm.

The placeholder reads "Listening" and the hint becomes "listening · tap the mic to stop". Reduced motion holds the face still.


## Components

The built pieces are mirrored in Figma as variant sets with their reasoning in the descriptions: **Composer components · as built** (Grip rest/typing/listening, Chip by kind plus hover, Token capability/yours, Field rest/typing).

## Not in this episode: resolving a person

Typing a person's name bundles two unknowns — who, and how to reach them. The rule, for whenever it gets built: a name resolves only through a connected channel, the same bound as capabilities. One match and the token shows how it resolved ("Marike · Slack"), generic in and specific out. Several and it picks, marks the pick, and lets you change it inline rather than asking first. No match and it becomes a `yours` token: unresolved, outlined, and flagged in the built workflow as a step pointing at nobody.

The principle is that a name it cannot resolve should look exactly as unfinished as a capability it does not have, instead of confidently inventing an address.

**Its own episode, not a footnote in this one.** T/01 already gestures at it: the node subtitle reads "Slack · #growers", which is the same abstract-to-specific move.

## 11 · Three states, each more concrete than the last

| | is | appears |
|---|---|---|
| **Chip** | what is connected and available | changes only when you type, or when your connections change |
| **Token** | what you have committed | the instant you take a chip or press enter |
| **Node** | what the token became | a beat after the token: skeleton first, then the specifics |

Available, committed, real.

## 12 · Absence only means "not connected"

A first pass filtered the chip row by sequence rules — one trigger only, no filter until there is a step. It read worse, and the reason is worth keeping.

**Hiding a chip because it is not connected is legible.** It was never there, and its absence is the truth about your setup.

**Hiding a chip because of a grammar rule is not.** You saw it a second ago, you committed something else, and it vanished with no reason on screen. The row stops being a stable picture of what you have, so you stop reading it as one.

So the row shows what is connected, filtered only by what you type. Sequence belongs to the canvas, which can show structure rather than only remove things.

**What survives from that pass**, because it is about meaning rather than availability:
- A condition is not a peer. In the field it rides the token in front of it: smaller, muted, outlined, tucked against it. Same reason it lands on a wire instead of becoming a box.
- Click any token to remove it. Removing a step takes its trailing conditions with it, because a condition with nothing to guard is not something to leave lying around.

Checked without a browser: `npm run check:rules`.

---

## FLOWIE pass (2026-09-03)

A navigator-lens critique, run against the question **how will any of this be known to the user?** Seventeen findings. The headline: it would not be. The resting state was an unlabelled handle and every affordance sat behind guessing it.

**Fixed**

| | Was | Now |
|---|---|---|
| Discovery | everything gated behind a 56×48 unlabelled rectangle; the transport hint named a field that was not on screen | the session is open by default. The grip closes it. Closed is a beat, not the front door. |
| Building | two Enters in a row built and wiped the composition, with no undo | building keeps your tokens. It is not a way to lose your work. |
| The empty line | "Nothing connected can do that yet" fired on any non-match, so a typo made the interface lie about your setup | "No match. Nothing connected does that yet." — the symptom first, the claim second |
| Focus | `focused` had no `onBlur`, so every orange signal latched on forever | focus is a state again, and orange means what the colour rule says it means |
| Absence | a taken chip vanished exactly like a disconnected one, giving absence three meanings | taken chips stay in the row, dimmed and disabled. Absence means "not connected", singular. |
| The top match | Enter took `chips[0]` with nothing marking it | the target carries a cue while you are typing |
| The result | the built line self-destructed after 2600ms, taking the "not connected" flag with it | it persists |
| The morph | `.grip i` was declared twice at equal specificity; the second silently dropped the position transitions, so the face **snapped** | one declaration. The morph is a morph again. |
| The gap | `.chips:empty { min-height: 0 }` cancelled the row's reservation at exactly the moment it existed for, so §4's deliberate pause was a layout jump | the row holds its height |
| Voice | a simulated envelope moved the mouth while the user was silent — the exact thing §8 forbids | no envelope. The face appearing IS the state; it does not perform. |
| Dashed | meant both "this is a condition" and "this is a request" | dashed is only ever a condition |
| Removal | tokens were clickable with no hover | they respond |
| The scripted run | ended with a dead-end string in the field | clears, so the first hands-on moment is one you can act from |

**Still open** — kept deliberately or not yet worth the code: the beat strip's single "rest" entry does not restore the resting state and silently clears; the grip says drag in three places and is a click toggle; tab order puts the chips after mic and send; `user-select: none` may block text selection in the field on some engines (one drag on localhost settles it).

**The structural note worth keeping:** three of the four highest-cost findings lived at the seam between the episode and the chassis, not inside the composer. The answer to "how will this be known" was being decided by the frame around it.
