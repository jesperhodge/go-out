import { Dispatch, SetStateAction } from 'react'
import { BACKEND_URL } from '@web/constants/base'
import { Gather, Participant } from '@customTypes/gather'
import { user } from '@web/app/constants'
import { UserResource } from '@clerk/types'

const encodeParams = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
}

const makeRequest = async (
  path: string,
  params: Record<string, any>,
  options: Record<string, any>,
  getToken: () => Promise<string | null>,
) => {
  const queryString = `?${encodeParams(params)}`
  const token = await getToken()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const response = await fetch(`${backendUrl}${path}${queryString}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}

export const createGathersClient = ({
  headers,
  getToken,
}: {
  headers: Record<string, string>
  getToken: () => Promise<string | null>
}) => {
  const getGathers = async () => {
    const params = {
      limit: 5,
    }
    const response = await makeRequest('/gathers', params, { headers }, getToken)
    const data = await response.json()

    if (data.error) {
      return null
    }
    if (!Array.isArray(data)) {
      return null
    }

    return data
  }

  const getGather = async (googlePlace: google.maps.places.PlaceResult) => {
    const params = {
      googleId: googlePlace.place_id,
      location: googlePlace.geometry?.location?.toString(),
    }
    const response = await makeRequest('/gather', params, { headers }, getToken)

    if (response.status !== 200) {
      return []
    }
    const data = await response.json()

    return data
  }

  const getGathersFromBounds = async (bounds: google.maps.LatLngBounds) => {
    const params = {
      bounds: JSON.stringify(bounds.toJSON()),
    }
    const response = await makeRequest('/gathers', params, { headers }, getToken)

    if (response.status !== 200) {
      return []
    }

    const data = await response.json()

    return data
  }

  const createGather = async (
    googlePlace: google.maps.places.PlaceResult,
    name: string,
    description: string,
    pictures: string[],
  ) => {
    const newGather: Gather = {
      name,
      description,
      pictures,
      googlePlace: {
        googleId: googlePlace.place_id,
        location: googlePlace.geometry?.location?.toString(),
        name: googlePlace.name,
        formatted_address: googlePlace.formatted_address,
        lat: googlePlace.geometry?.location?.lat(),
        lng: googlePlace.geometry?.location?.lng(),
      },
    }

    const response = await makeRequest(
      '/gathers',
      {},
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gather: newGather }),
      },
      getToken,
    )

    const data = await response.json()

    return data
  }

  const joinGather = async (gatherId: string) => {
    const response = await makeRequest(
      '/gathers/join',
      {},
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gatherId: gatherId }),
      },
      getToken,
    )

    const data = await response.json()

    return data
  }

  return { getGathers, getGather, getGathersFromBounds, createGather, joinGather }
}
