import { createContext } from 'react'

// One source of truth for "should this move?". Combines the OS preference with the chassis toggle,
// so every episode has its reduced-motion twin for free.
export const ReducedMotionContext = createContext<{ reduced: boolean; toggle: () => void }>({ reduced: false, toggle: () => {} })
