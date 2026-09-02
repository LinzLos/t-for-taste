// The corner mark. Same place, same size, every episode, so a feed recognises it before reading.
export function Mark({ number }: { number: number }) {
  return <div className="mark" aria-label={`T for Taste, episode ${number}`}>T/{String(number).padStart(2, '0')}</div>
}
