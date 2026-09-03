import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { episodes } from './episodes'
import { useReducedMotion } from './chassis/reduced-motion'

// The period is born out of the e: it starts small and behind the letter, grows as it rolls right,
// overshoots its slot a touch, then settles back. Deliberate, not eager. 0.6s delay so the title lands first.
function RollingDot() {
  const { reduced } = useReducedMotion()
  if (reduced) return <span className="dot">.</span>
  return (
    <motion.span
      className="dot"
      initial={{ x: '-0.72em', scale: 0.15, opacity: 1 }}
      animate={{ x: ['-0.72em', '0.14em', '0em'], scale: [0.15, 1.04, 1] }}
      transition={{ delay: 0.6, duration: 1.4, times: [0, 0.72, 1], ease: [[0.4, 0, 0.2, 1], [0.33, 1, 0.68, 1]] }}
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
      <div className="title-clip"><h1>T for<br />Taste<RollingDot /></h1></div>
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
