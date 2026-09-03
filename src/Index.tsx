import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { episodes } from './episodes'
import { useReducedMotion } from './chassis/reduced-motion'

// The period rolls in like a ball: from the right edge, decelerates, overshoots into the word,
// snaps back into its slot with a squash on landing. Deliberate. 0.5s delay so the title lands first.
function RollingDot() {
  const { reduced } = useReducedMotion()
  if (reduced) return <span className="dot">.</span>
  return (
    <motion.span
      className="dot"
      initial={{ x: '58vw', scaleX: 1.25, scaleY: 0.8, opacity: 0 }}
      animate={{ x: ['58vw', '-0.22em', '0em'], scaleX: [1.25, 0.82, 1], scaleY: [0.8, 1.18, 1], opacity: [0, 1, 1] }}
      transition={{ delay: 0.5, duration: 1.25, times: [0, 0.78, 1], ease: ['circOut', [0.34, 1.56, 0.64, 1]] }}
    >
      .
    </motion.span>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Index() {
  const rows = episodes.slice().reverse()
  return (
    <main className="index">
      <h1>T for<br />Taste<RollingDot /></h1>
      <p className="lede">One interaction per episode. The default, the change, the reason, and the actual numbers.</p>
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
