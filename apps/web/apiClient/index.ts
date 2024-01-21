import { useAuth } from '@clerk/nextjs'
import { createGathersClient } from './gathers'
import { useMemo } from 'react'

export function useClient(): ReturnType<typeof createGathersClient> {
  const { getToken } = useAuth()

  const client = useMemo(() => {
    const headers = {
      'Content-Type': 'application/json',
    }

    return createGathersClient({ headers, getToken })
  }, [getToken])

  return client
}
