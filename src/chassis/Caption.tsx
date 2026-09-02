import type { EpisodeMeta } from '../episodes/types'

// Default. Change. Reason. Then the numbers. Same voice every time.
export function Caption({ meta }: { meta: EpisodeMeta }) {
  return (
    <aside className="caption">
      <dl>
        <dt>Default</dt><dd>{meta.caption.default}</dd>
        <dt>Change</dt><dd>{meta.caption.change}</dd>
        <dt>Reason</dt><dd>{meta.caption.reason}</dd>
      </dl>
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
      <p className="meta-line">{meta.material} · {meta.library}</p>
    </aside>
  )
}
