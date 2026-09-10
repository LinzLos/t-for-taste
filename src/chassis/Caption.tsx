import type { EpisodeMeta } from '../episodes/types'

// Default. Change. Reason. Then the numbers. Same voice every time.
// Default. Change. Reason. Then what it is not. The colours sit beside it, grouped by what they are for.
export function Caption({ meta }: { meta: EpisodeMeta }) {
  return (
    <aside className={meta.palette?.length ? 'caption caption--split' : 'caption caption--plain'}>
      <div className="caption-col">
        <h2>The call</h2>
        <dl>
          <dt>Default</dt><dd>{meta.caption.default}</dd>
          <dt>Change</dt><dd>{meta.caption.change}</dd>
          <dt>Reason</dt><dd>{meta.caption.reason}</dd>
          {meta.caption.not && <><dt>Not</dt><dd>{meta.caption.not}</dd></>}
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
