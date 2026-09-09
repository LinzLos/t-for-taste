import { useContext, useEffect } from 'react'
import { BeatsContext, type BeatControls } from './beats-context'

// Pass null to register nothing: the transport then shows only the motion toggle.
export function useRegisterBeats(ctl: BeatControls | null) {
  const { setCtl } = useContext(BeatsContext)
  useEffect(() => { setCtl(ctl); return () => setCtl(null) }, [ctl, setCtl])
}

export const useBeats = () => useContext(BeatsContext).ctl
