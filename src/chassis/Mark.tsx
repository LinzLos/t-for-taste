// The corner mark. Same place, same size, every episode, so a feed recognises it before reading.
// "T no. 1", never "T/01": zero-padding is a sort key, and the period and the space are the
// typographic tradition (Penguin spines, record sleeves) that makes it read as set by a person.
export function Mark({ number }: { number: number }) {
  return <div className="mark" aria-label={`T for Taste, episode ${number}`}>T no. {number}</div>
}
