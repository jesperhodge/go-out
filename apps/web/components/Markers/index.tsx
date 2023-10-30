import { FunctionComponent, useState, useEffect } from 'react'
import { useGoogleMap } from '@ubilabs/google-maps-react-hooks'

/**
 * Component to render all map markers
 */
export const Markers: FunctionComponent<Record<string, any>> = ({ gatherList }) => {
  // Get the global map instance with the useGoogleMap hook
  const map = useGoogleMap()

  const [, setMarkers] = useState<Array<google.maps.Marker>>([])

  // Add markers to the map
  useEffect(() => {
    if (!map) {
      return () => {}
    }

    const initialBounds = new google.maps.LatLngBounds()

    const gatherMarkers: Array<google.maps.Marker> = gatherList.map((gather: any) => {
      const name = gather.name
      const position = {
        lat: gather.googlePlace.lat,
        lng: gather.googlePlace.lng,
      }

      const markerOptions: google.maps.MarkerOptions = {
        map,
        position,
        title: name,
        clickable: false,
      }

      initialBounds.extend(position)

      return new google.maps.Marker(markerOptions)
    })

    setMarkers(gatherMarkers)

    // Clean up markers
    return () => {
      gatherMarkers.forEach((marker) => marker.setMap(null))
    }
  }, [map, gatherList])

  return null
}
