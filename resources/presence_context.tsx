import * as React from 'react'
import type { User } from '~/types/user'
import useParams from './hooks/use_params'

export const PresenceContext = React.createContext<User['id'][]>([])

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [presence, setPresence] = React.useState<User['id'][]>([])
  const params = useParams()

  React.useEffect(() => {
    let es = new EventSource(`/organizations/${params.organizationSlug}/presence`)

    es.onmessage = (event) => {
      const { presence } = JSON.parse(event.data)
      setPresence(presence)
    }

    return () => {
      es.close()
    }
  }, [])

  return <PresenceContext.Provider value={presence}>{children}</PresenceContext.Provider>
}
