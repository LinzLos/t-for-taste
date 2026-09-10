import type { EpisodeMeta } from '../episodes/types'

// The reader's own questions, in the order they ask them: what it is, what it does, why, and what it
// isn't. "Default" and "Change" described the machine's states, not the thing, and nobody asks either.
// The colours sit beside it, grouped by what they are for.
export function Caption({ meta }: { meta: EpisodeMeta }) {
  return (
    <aside className={meta.palette?.length ? 'caption caption--split' : 'caption caption--plain'}>
      <div className="caption-col">
        <h2>The call</h2>
        <dl>
          <dt>What it is</dt><dd>{meta.caption.is}</dd>
          <dt>What it does</dt><dd>{meta.caption.does}</dd>
          <dt>Why</dt><dd>{meta.caption.why}</dd>
          {meta.caption.not && <><dt>What it isn't</dt><dd>{meta.caption.not}</dd></>}
        </dl>
      </div>
      {meta.palette && meta.palette.length > 0 && (
        <div className="caption-col">
          <h2>The palette</h2>
          <div className="palette">
          {meta.palette.map(g => (
            <section key={g.group}>
              <h3>{g.group}</h3>
              <ul>
                {g.items.map(c => (
                  <li key={c.hex}>
                    <i style={{ background: c.hex }} aria-hidden />
                    <span className="job">{c.job}</span>
                    <span className="hex">{c.hex}</span>
                    {c.use && <span className="use">{c.use}</span>}
                  </li>
                ))}
              </ul>
            </section>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
