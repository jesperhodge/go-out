'use client'

import React, { FunctionComponent, useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react'
import { GoogleMapsProvider } from '@ubilabs/google-maps-react-hooks'

import { Gather } from '@customTypes/gather'
import MapCanvas from '@web/components/MapCanvas'
import PlaceFinder from '@web/components/PlaceFinder'
import { GatherGallery } from '@web/components/GatherGallery'
import { Toolbar } from '@web/components/Toolbar'
import { Markers } from '@web/components/Markers'

const mapOptions = {
  center: { lat: 53.5582447, lng: 9.647645 },
  zoom: 6,
  disableDefaultUI: true,
  zoomControl: false,
}

const baseUrl = 'http://localhost:4000'

const encodeParams = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
}

const getGathers = async (setGathers: Dispatch<SetStateAction<Gather[]>>) => {
  const params = {
    limit: 5,
  }
  const queryString = encodeParams(params)
  const response = await fetch(`${baseUrl}/gathers?${queryString}`)
  console.log('getGather response: ', response)
  const data = await response.json()
  console.log('getGather data: ', data)

  if (data.error) {
    console.log('error: ', data.error)
    return
  }
  if (!Array.isArray(data)) {
    return
  }
  setGathers(data)
  return data
}

const Dashboard: FunctionComponent<Record<string, unknown>> = () => {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)
  const mapRef = useCallback((node: React.SetStateAction<HTMLDivElement | null>) => {
    node && setMapContainer(node)
  }, [])
  const [gatherList, setGatherList] = useState<Gather[]>([])

  useEffect(() => {
    getGathers(setGatherList)
  }, [])

  return (
    <GoogleMapsProvider
      googleMapsAPIKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      mapContainer={mapContainer}
      mapOptions={mapOptions}
      // Add the places library
      libraries={['places']}
    >
      <div id="container">
        <MapCanvas ref={mapRef} />
        <Markers gatherList={gatherList} />
        <PlaceFinder gatherList={gatherList} setGatherList={setGatherList} />
        <GatherGallery gatherList={gatherList} />
        <Toolbar />
      </div>
    </GoogleMapsProvider>
  )
}

export default Dashboard
