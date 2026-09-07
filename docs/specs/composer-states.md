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

## 13 · Kind is words and position. Colour is state.

FLOWIE's sharpest finding was about the chip states, and the fix was subtraction.

Kind was encoded in border treatment with no legend: teal for triggers, dashed for conditions, plain for actions, dashed orange for requests. Three of those were redundant with the label and one was actively misleading.

- **"When a page is saved" already says it is a trigger.** The teal added nothing and contradicted the colour rule, where teal means the system is alive.
- **"Only if it mentions pricing" already says it is a condition.** And dashed universally reads as *disabled*, so the chip carrying the best structural idea looked like the one you could not click.
- **"Curate it to my taste" does not say nothing can do it.** That meaning is not in the words, so it is the one kind that still earns a mark.

So kind is carried by the words, and by position where it matters: a condition proves itself structurally, riding its step in the field and sitting on the wire on the canvas. Those are stronger signals than a border style, and they are the ones this episode invented.

Colour is left to mean **state**, one meaning each:

| | |
|---|---|
| available | default |
| taken | dimmed, disabled, still in the row |
| top match | ink border on the field ground, while you are typing |
| yours | orange outline — a request, not a capability |

## 14 · No tooltips on the chips

**The test:** a tooltip is where you put the thing you could not design. If the chip needs explaining, the label is wrong.

Kind does not need a tip — the words carry it. The one thing a chip genuinely cannot say in a short label is its **binding**: which workspace, which channel. But that arrives one step later on the node, which is exactly the abstract-to-specific move the canvas exists for.

**Where binding is ambiguous, put it in the label, not a tip.** If two Slack workspaces are connected, the chip reads "Post to Slack · #growers". If that makes labels unwieldy, the unwieldiness is real information about how many near-identical capabilities you have.

Same reason the keyboard hint came off: nothing on this surface explains itself in prose.

---

## 15 · Voice, real (2026-09-05)

Lindsay's call: build the voice real, with the animation, and grow from there. So the face is driven by the microphone and nothing else.

**Pipeline.** `getUserMedia({ audio })` → `AudioContext` → `AnalyserNode` (fftSize 256, smoothing 0.75) → one `requestAnimationFrame` loop reading `getByteFrequencyData` → three band averages (≈0–375 Hz · 375–2 kHz · 2–6 kHz), floored at 0.12 and gained 1.6, clamped to 0–1. Levels are read and thrown away sixty times a second. Nothing is recorded, uploaded or transcribed. `src/episodes/01-live-session/use-mic.ts`, ~50 lines, no library.

**Consent is the browser's and it is not optional.** The context is created inside the click (iOS will not start audio otherwise), the permission prompt is the browser's own, and the browser shows its mic indicator the whole time. Toggling voice off releases the tracks and closes the context in the same tick, so that indicator disappears with it. Leaving the mic open after the face has gone would be a trust failure.

**Denied is a state, not an error.** If the user refuses, or the page is in a browser that blocks capture (in-app browsers, LinkedIn's included), the face never appears, and both the mic button and the gripper's status dot go salmon — trouble, in the colour rule. The field says it too (Lindsay's call, 2026-09-06: state copy in the composer so the viewer knows what changed): "Microphone not allowed. Type instead." Verified in the Browser pane, which blocks the mic: the gripper reports "microphone not allowed" and the mouth stays flat.

**One phase.** `rest · typing · pending · listening · denied` is derived once from the mic hook's own state (`off · pending · on · denied`) plus focus, and every surface reads it: the grip's mode, the field's placeholder ("Waiting for the microphone" while the browser asks; "Listening. Say what it should do." once it has said yes), the status tag (`drafting → listening`), the mic button's colour and label. Listening comes from the hook, never from the click, so a refusal or an unsupported browser can never flash a face. **Leaving the composer releases the mic**: the beat-strip reset and replay both go through one `reset()` that calls `mic.stop()`.

**It resolves the FLOWIE finding.** A face on a timer performed while you were silent. A face on the microphone cannot perform: it has nothing to perform with.

## 16 · The gripper (her 119×64 redesign)

One inline SVG, `viewBox 0 0 119 64`, so it is the same drawing at any rendered size. Two plates: the top carries the 3×3 grid (6px dots on an 8px pitch) and a single status dot at the far right; the bottom carries the mouth.

- **The grid is rigid; the mouth is soft.** That contrast is the "organic yet roboty". Dots stay on an integer grid with 140ms colour changes and no easing wobble. All the organic quality goes to the mouth.
- **The mouth is one quadratic.** Flat `M 14 50 Q 59.5 50 105 50` (a 12px round-capped stroke in the canvas colour, which reads as the slot) → smile `M 20 45 Q 59.5 67 99 45`. Tweened by hand over 260ms on the settle curve and written straight to the `d` attribute. (A `motion.path` with an animated `d` reads its start from the DOM and can land on `"undefined"` for a frame — the console said so.) Reduced motion: it snaps.
- **The unroll (her frame 212:6988, 2026-09-06).** On voice the 3×3 spreads sideways into a **9×3 meter across the whole plate**: the three grip columns move from an 8px pitch to a 12px one, and six new columns emerge from the third and slide into place, each a few percent behind the last, 320ms on the settle curve. One progress value drives every column's x and arrival, so it reads as one thing unrolling rather than dots appearing. The status dot fades out as it goes — the meter is the status now. It rolls back the same way when voice stops.
- **The meter, while listening (revised 2026-09-06 after her eyes on 5181).** The first pass read as static. Three causes, none of them needing more dots: continuous per-dot opacity (fuzz, not bars), raw per-frame levels with no ballistics (jitter), and a 0.22 floor that greyed the whole plate. Her reference frame (186:6013) settles the idiom: **every dot is on or off, unlit is off.** A column is a bar of one to three, bottom always lit so it is still a grip. **Ballistics** make it motion: attack 25ms, release 180ms as time constants, so a bar leaps up and sinks. **Neighbours lean on each other** (0.2 · 0.6 · 0.2) so adjacent columns move as a wave rather than noise. A **peak** holds for 450ms then falls a row every 120ms — the LED-meter idiom, and with only three rows it is what gives the top row a life of its own. Bands are nine, log-spaced 80Hz–6k over a 1024-point FFT, with a 15%-per-column tilt so the high columns get a say against a voice that rolls off. Each dot's on/off has an 80ms ease: crisp, not harsh. The unroll now goes **grid → line → meter**: the grip's upper rows go out as it spreads, new columns arrive bottom-only, and sound builds the bars from there.

If three rows still feel coarse in her hands, the next move is five rows on a 6px pitch inside the same plate, not a bigger plate. Try the initial design first (her call).
- **Colour is state.** Ink at rest, orange while typing or listening (you are doing something), status dot salmon when the mic is refused.
- **It is a widget now, not a handle.** Docked under the bar, top left beneath the name (Lindsay, 2026-09-06: the name and the thing that is alive sit together; the bindings go right). It no longer gates the session; the composer is on the canvas once a project is chosen.

Open, for her eyes: the unroll timing, and whether nine columns respond legibly to speech. The bottom-row anchor is the bet.

**Preview flag:** `#/01?face` holds the listening face without a microphone, for tuning and for recording. The mouth is a `MotionValue` driven by `animate(value, to)` — never `animate(string, …)`, which treats the string as a CSS selector and throws.

## 17 · The layout, from her four screens (2026-09-05)

1. **Rest.** Bar with `friendly agent composer` (Fredoka, teal) on the left and the bindings on the right. Empty dot-grid canvas — a place things will land, not an empty room. Gripper top left under the name. (The project picker and the capability chips are parked behind `?pick` and `?chips`: other episodes' stories, kept, not deleted. Without the flags the project is already chosen and the composer is on the canvas from the first frame.)
2. **Picking.** A 350px menu under the bar: search first (orange underline), then projects in mono. Enter takes the first match; Escape closes; clicking anywhere else closes.
3. **Project chosen.** The bar becomes bindings: folder glyph, `main`, `tuliptech-docs`, and a status tag that reads `drafting` until a build, then `standing by`. The composer rises onto the canvas (260ms CSS, none under reduced motion): a 740px field, `Describe your workflow`, mic glyph inside it at the right, chips centred beneath in an 880px row.
4. **Typing.** The field's bottom edge and the gripper's dots go orange together.

The send arrow is gone; her screens have only the mic, and Enter with nothing typed builds. The built line sits above the field.

**On transcription (2026-09-06).** Lindsay asked whether words should appear in the field as she talks. Decision: not in this slice. The browser speech API is small, but in Chrome it sends audio to Google, which breaks the nothing-leaves-this-device claim; it does not exist in Firefox or in-app browsers. Words for some viewers with a privacy asterisk is a second feature with its own decisions. Instead the field states it: placeholder "Listening", orange edge, the meter alive. The caption carries the rest.

## Review pass (2026-09-06)

Eight-angle code review, verified. Fixed: the beat-strip reset and replay left the microphone open with no control on screen (one `reset()` now releases it); a refusal or an unsupported browser flashed the listening face for a frame (listening is derived from the hook's state, never from the click); a retry stayed salmon through the new prompt; the meter dropped the first 320ms of speech during the unroll (bookkeeping never waits, only the drawing); `ac.resume()` is awaited inside the try; the voice-script run now ends built; the `yours` id normalises whitespace; the settle curve lives in one `EASE`; the mic tick allocates nothing per frame; the field's line height is measured once; `.mic:where(:hover)` uses the same zero-specificity trick as the button reset; `.chip--yours` has its outline back per §13. Left as is: the beat strip's `go` ignores its index (one beat); the 80ms on/off ease on dots (deliberate, values only change on a row change); the parked stories stay behind flags rather than becoming components until they are their own episodes.

## 18 · The grip is the way in, and the way through (Lindsay, 2026-09-06; FLOWIE friction pass)

Clicking anywhere used to focus the field, which misled: it suggested the surface was a text box you address. For a voice demo the entry is the grip and nothing else.

**One phase, ten values, every surface reads it.** `closed · rest · typing · pending · listening · stopped · cancelled · denied · unsupported · lost`, derived once from the mic hook's own state (`off · pending · on · stopped · cancelled · denied · unsupported · lost`) plus `open` and focus. Listening comes from the hook, never from the click, so a refusal can never flash a face. Adding a phase without all six columns below is the regression.

| phase | grip (dots · status dot · label) | field edge | placeholder | status tag |
|---|---|---|---|---|
| closed | ink · **teal** (alive, pressable) · *open the composer and listen* | — | — | idle |
| rest (open, idle) | dots quiet (muted) · teal · *close the composer* | plain | Describe your workflow | drafting / standing by |
| typing | orange · orange | orange | (your text) | drafting |
| pending | orange · orange · *stop listening* | orange | The browser is asking for the microphone. | asking |
| listening | 9×3 meter + smile · *stop listening* | orange | Listening. Say what it should do. | listening |
| stopped | quiet dots · teal · *close the composer* | plain | Stopped listening. Nothing you said was saved. | stopped — and the mic glyph becomes a teal mono **`done`** tag that closes (Lindsay: a check reads as every AI product's icon; the system speaks in mono tags here) |
| cancelled | ink · teal | plain | Stopped asking for the microphone. | drafting |
| denied | ink · **salmon** · *close the composer* | salmon | Microphone not allowed. Try again, or type. | no microphone |
| unsupported | ink · salmon | salmon | No microphone in this browser. Try Safari or Chrome, or type. | no microphone |
| lost | ink · salmon · *close the composer* | salmon | The microphone went away. Press the mic to try again, or type. | no microphone |

**One meaning per control (Lindsay, 2026-09-06: the double press "is weird, might be non-intuitive" — it was).** The grip is a drawer handle: press → the composer opens already listening (the mic starts inside the same click, which is what iOS needs); press → it closes, releasing the mic, clean slate. The mic glyph is the mic: orange while listening, press to stop, and then it is the `done` tag, which closes. Nothing cycles; the grip's accessible name is *open the composer and listen* / *close the composer*. Pressing the grip mid-sentence closes rather than pauses, and closing stops the mic, so that is fine. *Start listening* ← grip (from closed), glyph (from a text phase). *Stop* ← glyph only. *Close* ← grip, `done`, Escape.

**Pressable without a pointer.** The teal status dot at rest is the cue; hover lights the dots orange only where hover exists (`@media (hover: hover)`, so a phone tap does not stick); the keyboard ring lights them the same way. Escape stops listening, else closes.

**Copy names what changed and where the action is.** "The browser is asking" points at the prompt. "Stopped listening. Nothing you said was saved." states the two facts a viewer needs, in words a person outside the tool has (Lindsay: ELI5 it; "kept" and "transcribe" were abstract). Refused and unsupported are different states with different sentences; refused offers the retry.

**Lost.** The one way the face could lie: a headset drops, or the tab comes back from the background with the audio context suspended (iOS). The track's `ended` and the context's `statechange` are watched; on return to the foreground the context is asked to resume, and if it will not, the phase is `lost` with its own sentence. Never a flat meter that still claims to listen.

**Voice or text, never both (Lindsay, 2026-09-06: "if it is only listening then the pill and type input is like, what is happening").** While it asks, listens or has just stopped, the field is a single sentence and the glyph — no text box, no caret, no pills. In every other open phase the text box and pills come back, because the keyboard is the fallback when the mic cannot be used. Starting to listen always begins from empty, which is what "nothing you said was saved" already promises.

**The typing door.** Typing exists because the refused, unsupported and lost sentences offer it, so it has to go somewhere true. In this slice a typed sentence becomes one request pill on Enter — *if it looks like words*: real words have vowels and a keyboard mash does not; tags, handles and numbers pass (`looksLikeWords`, covered by `check:rules`). Otherwise the field keeps the text and says "Not sure what that means. Try words, like: summarize it for #growers". With pills present the text takes its own row so a state sentence always reads in full. And that is all: no build, no built line, no "not connected" warning. Those are the chips story's vocabulary (`?chips`). Backspace takes a request back.

**▶ play enters through the grip.** On this slice the transport's play opens the composer listening and then waits for you; the typing script belongs to the chips story (`?chips`).

**Every device.** The episode declares a square frame (`stage: 1080×1080`) and `fluidMin: 0`, so it lays itself out at any width instead of being scaled: under 640px of composer width a container query brings the bar to 64px, the type down with `cqw` clamps, and the grip stays a 119×64 tap target. The record frame is the square.
