import { useContext } from 'react'
import { ReducedMotionContext } from './reduced-motion-context'

export const useReducedMotion = () => useContext(ReducedMotionContext)
