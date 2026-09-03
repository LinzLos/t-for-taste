import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { episodes } from './episodes'
import { useReducedMotion } from './chassis/reduced-motion'
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
      <span className="sr">.</span>
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
  return (
    <main className="index">
      <div className="title-clip"><h1>T for<br /><RollingDot /></h1></div>
      <p className="lede">Small React and TypeScript builds about how AI products should feel, one call at a time.</p>
      <ol className="episode-list">
        {rows.map(({ meta }) => (
          <li key={meta.slug} data-status={meta.status}>
            <Link to={`/${pad(meta.number)}`}>
              <span className="num">T/{pad(meta.number)}</span>
              <span className="name">{meta.title}</span>
              <span className="mat">{meta.material}</span>
              {meta.status === 'draft' && <span className="draft">draft</span>}
            </Link>
          </li>
        ))}
      </ol>
      <Footer />
    </main>
  )
}
