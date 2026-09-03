import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { episodes } from './episodes'
import { useReducedMotion } from './chassis/reduced-motion'

// The period rolls out of the e. Two ideas: a GATE (an overflow-hidden window that starts at the
// e's right edge, so nothing shows until the ball crosses it) and a real ROLL (an off-centre highlight,
// rotated by distance / radius, so the turn is visible). The ball is its own circle sitting on the
// baseline, so there is no glyph geometry to guess. A visually hidden "." keeps the text honest.
const BALL = { r: 0.085, start: -1.05, over: 0.14 } // em
function RollingDot() {
  const { reduced } = useReducedMotion()
  const turnOut = ((BALL.over - BALL.start) / BALL.r) * (180 / Math.PI)
  const turnBack = (BALL.over / BALL.r) * (180 / Math.PI)
  return (
    <span className="gate">
      <span className="sr">.</span>
      {reduced ? (
        <span className="ball" aria-hidden />
      ) : (
        <motion.span
          className="ball"
          aria-hidden
          initial={{ x: `${BALL.start}em`, rotate: 0 }}
          animate={{ x: [`${BALL.start}em`, `${BALL.over}em`, '0em'], rotate: [0, turnOut, turnOut - turnBack] }}
          transition={{ delay: 0.6, duration: 1.4, times: [0, 0.72, 1], ease: [[0.4, 0, 0.2, 1], [0.33, 1, 0.68, 1]] }}
        />
      )}
    </span>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Index() {
  const rows = episodes.slice().reverse()
  return (
    <main className="index">
      <div className="title-clip"><h1>T for<br />Taste<RollingDot /></h1></div>
      <p className="lede">I build AI products. Here's what I'm exploring: React and TypeScript patterns, each with a twist.</p>
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
      <p className="sign">Ship fast, laugh last.</p>
    </main>
  )
}
