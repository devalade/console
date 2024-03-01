import { PresenceContext } from '@/presence_context'
import * as React from 'react'

export default function usePresence() {
  return React.useContext(PresenceContext)
}
