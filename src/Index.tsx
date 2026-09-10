import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { episodes } from './episodes'
import { useReducedMotion } from './chassis/use-reduced-motion'
import { Footer } from './chassis/Footer'

// The period rolls out of the e. Two ideas: a GATE (an overflow-hidden window that starts at the
// e's right edge, so nothing shows until the ball crosses it) and a real ROLL (an off-centre highlight,
// rotated by distance / radius, so the turn is visible). The ball is its own circle sitting on the
// baseline, so there is no glyph geometry to guess. A visually hidden "." keeps the text honest.
const BALL = { r: 0.085, start: -1.05, over: 0.14 } // em
function RollingDot() {
  const { reduced } = useReducedMotion()
  const [settled, setSettled] = useState(reduced)
  const [olive, setOlive] = useState(false)
  const turnOut = ((BALL.over - BALL.start) / BALL.r) * (180 / Math.PI)
  const turnBack = (BALL.over / BALL.r) * (180 / Math.PI)
  const rest = turnOut - turnBack

  // The easter egg: once the period has settled, hovering it turns it a quarter turn into an olive.
  // Some days are better than others. Mostly a period, occasionally a martini.
  const roll = { x: [`${BALL.start}em`, `${BALL.over}em`, '0em'], rotate: [0, turnOut, rest] }
  const hover = { x: '0em', rotate: olive ? rest + 90 : rest }

  // Touch has no hover: tapping the word toggles the olive. Desktop keeps hover on the dot.
  const toggle = () => settled && setOlive(o => !o)
  return (
    <>
    <span className="taste" onClick={toggle}>Taste</span>
    <span className="gate" onMouseEnter={() => settled && setOlive(true)} onMouseLeave={() => setOlive(false)} onClick={toggle}>
      {reduced ? (
        <span className={olive ? 'ball is-olive' : 'ball'} aria-hidden />
      ) : (
        <motion.span
          className={olive ? 'ball is-olive' : 'ball'}
          aria-hidden
          initial={{ x: `${BALL.start}em`, rotate: 0 }}
          animate={settled ? hover : roll}
          transition={settled
            ? { duration: 0.26, ease: [0.33, 1, 0.68, 1] }
            : { delay: 0.6, duration: 1.4, times: [0, 0.72, 1], ease: [[0.4, 0, 0.2, 1], [0.33, 1, 0.68, 1]] }}
          onAnimationComplete={() => setSettled(true)}
        />
      )}
    </span>
    </>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Index() {
  const rows = episodes.slice().reverse()
  // ?display=<name> swaps the title face without touching the body, so the rolling dot can be judged
  // against a different e. Nothing else in the chassis moves.
  const [params] = useSearchParams()
  const display = params.get('display')
  const textCase = params.get('case')
  const shade = params.get('shade')
  const body = params.get('body')
  useEffect(() => {
    if (display) document.documentElement.dataset.display = display
    else delete document.documentElement.dataset.display
    if (textCase) document.documentElement.dataset.case = textCase
    else delete document.documentElement.dataset.case
    if (shade) document.documentElement.dataset.shade = shade
    else delete document.documentElement.dataset.shade
    if (body) document.documentElement.dataset.body = body
    else delete document.documentElement.dataset.body
  }, [display, textCase, shade, body])

  return (
    <main className="index">
      {/* Two layers. The letters are raised and cast the shade onto the paper; the ball rolls on that
          same paper, so it rides the shade's baseline, not the letters'. The gate still does the
          clipping, so the ball is never seen crossing a letter. */}
      <div className="title-clip">
        <div className="title-stack">
          <span className="tlay tlay--shade" aria-hidden>T for<br />Taste</span>
          <h1 className="tlay tlay--face">T for<br /><RollingDot /></h1>
        </div>
      </div>
      <p className="lede">Playful React and TypeScript builds about how AI product should feel.</p>
      <ol className="episode-list">
        {rows.map(({ meta }) => (
          <li key={meta.slug} data-status={meta.status}>
            {/* her row (Figma 239:338): the name, and one line on what it explores. Mono, ruled, nothing else. */}
            <Link to={`/${pad(meta.number)}`}>
              <span className="label">t no. {meta.number}</span>
              <span className="name">{meta.title}</span>
              <span className="blurb">{meta.blurb ?? meta.material}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Footer />
    </main>
  )
}
