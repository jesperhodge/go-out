'use client'

import React, { FunctionComponent, useState, useCallback } from 'react'
import { GoogleMapsProvider } from '@ubilabs/google-maps-react-hooks'

import MapCanvas from '../../components/MapCanvas'
import PlacesAutocompleteService from '../../components/PlacesAutocompleteService'

const mapOptions = {
  center: { lat: 53.5582447, lng: 9.647645 },
  zoom: 6,
  disableDefaultUI: true,
  zoomControl: false,
}

const Dashboard: FunctionComponent<Record<string, unknown>> = () => {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)

  const mapRef = useCallback((node: React.SetStateAction<HTMLDivElement | null>) => {
    node && setMapContainer(node)
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
        <PlacesAutocompleteService />
      </div>
    </GoogleMapsProvider>
  )
}

export default Dashboard
