// Pure geometry for the plaster. No DOM, so it's easy to tune and test.

export const PANEL = { w: 760, h: 740 } as const
export const GRID = { cols: 7, rows: 9, jitter: 0.38 } as const

type Pt = readonly [number, number]

// Small seeded RNG so a given seed always shatters the same way (useful when tuning on camera).
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Shard {
  /** clip-path polygon, px relative to the panel */
  clip: string
  /** centroid, px relative to the panel */
  cx: number
  cy: number
}

// A jittered lattice: interior points move, edge points stay on the edge, so
// neighbouring shards share every edge and nothing shows through the gaps.
export function makeShards(rand: () => number): Shard[] {
  const { cols, rows, jitter } = GRID
  const cw = PANEL.w / cols
  const rh = PANEL.h / rows
  const pts: Pt[][] = []
  for (let j = 0; j <= rows; j++) {
    const row: Pt[] = []
    for (let i = 0; i <= cols; i++) {
      const edgeX = i === 0 || i === cols
      const edgeY = j === 0 || j === rows
      const x = i * cw + (edgeX ? 0 : (rand() - 0.5) * cw * jitter * 2)
      const y = j * rh + (edgeY ? 0 : (rand() - 0.5) * rh * jitter * 2)
      row.push([x, y])
    }
    pts.push(row)
  }
  const shards: Shard[] = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const quad = [pts[j][i], pts[j][i + 1], pts[j + 1][i + 1], pts[j + 1][i]]
      const cx = quad.reduce((s, p) => s + p[0], 0) / 4
      const cy = quad.reduce((s, p) => s + p[1], 0) / 4
      shards.push({
        clip: `polygon(${quad.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(', ')})`,
        cx,
        cy,
      })
    }
  }
  return shards
}

// Cracks radiate from a point and wander to (and past) the stage edge.
export function makeCracks(origin: Pt, count: number, reach: number, rand: () => number): string[] {
  const paths: string[] = []
  for (let k = 0; k < count; k++) {
    const angle = (k / count) * Math.PI * 2 + (rand() - 0.5) * 0.9
    const segs = 9 + Math.floor(rand() * 6)
    let [x, y] = origin
    let a = angle
    let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`
    for (let s = 0; s < segs; s++) {
      const step = (reach / segs) * (0.6 + rand() * 0.8)
      a += (rand() - 0.5) * 0.9
      x += Math.cos(a) * step
      y += Math.sin(a) * step
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    }
    paths.push(d)
  }
  return paths
}
