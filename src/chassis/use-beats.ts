import { useContext, useEffect } from 'react'
import { BeatsContext, type BeatControls } from './beats-context'

export function useRegisterBeats(ctl: BeatControls) {
  const { setCtl } = useContext(BeatsContext)
  useEffect(() => { setCtl(ctl); return () => setCtl(null) }, [ctl, setCtl])
}

export const useBeats = () => useContext(BeatsContext).ctl
