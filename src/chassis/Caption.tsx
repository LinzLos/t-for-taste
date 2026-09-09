import type { EpisodeMeta } from '../episodes/types'

// Default. Change. Reason. Then the numbers. Same voice every time.
export function Caption({ meta }: { meta: EpisodeMeta }) {
  return (
    <aside className={meta.values.length ? 'caption' : 'caption caption--plain'}>
      <dl>
        <dt>Default</dt><dd>{meta.caption.default}</dd>
        <dt>Change</dt><dd>{meta.caption.change}</dd>
        <dt>Reason</dt><dd>{meta.caption.reason}</dd>
        {meta.caption.not && <><dt>Not</dt><dd>{meta.caption.not}</dd></>}
      </dl>
      {meta.palette && meta.palette.length > 0 && (
        <ul className="palette" aria-label="colours and their jobs">
          {meta.palette.map(c => (
            <li key={c.hex}><i style={{ background: c.hex }} aria-hidden /><span>{c.job}</span><span className="hex">{c.hex}</span></li>
          ))}
        </ul>
      )}
      {meta.values.length > 0 && (
        <table className="values">
          <caption>If you're stealing this</caption>
          <tbody>
            {meta.values.map(v => (
              <tr key={v.label}><th scope="row">{v.label}</th><td>{v.value}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </aside>
  )
}
