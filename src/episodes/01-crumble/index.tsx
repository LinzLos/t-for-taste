import { meta } from './meta'

// Draft stub. The plaster build lands here.
export { meta }
export default function Crumble() {
  return (
    <div className="stub">
      <span>T/{String(meta.number).padStart(2, '0')}</span>
      <span>{meta.material}, in progress</span>
    </div>
  )
}
