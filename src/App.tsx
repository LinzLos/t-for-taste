import { HashRouter, Route, Routes } from 'react-router-dom'
import { Frame } from './chassis/Frame'
import { ReducedMotionProvider } from './chassis/reduced-motion'
import { episodes } from './episodes'
import { Index } from './Index'

const pad = (n: number) => String(n).padStart(2, '0')

// HashRouter so GitHub Pages needs no 404 rewrite. Record mode is /#/01?record
export default function App() {
  return (
    <ReducedMotionProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {episodes.map(({ meta, Component }) => (
            <Route
              key={meta.slug}
              path={`/${pad(meta.number)}`}
              element={<Frame meta={meta}><Component /></Frame>}
            />
          ))}
        </Routes>
      </HashRouter>
    </ReducedMotionProvider>
  )
}
