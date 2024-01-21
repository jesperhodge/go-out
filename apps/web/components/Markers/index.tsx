import { FC, useState, useEffect, useContext, useCallback } from 'react'
import { useGoogleMap } from '@ubilabs/google-maps-react-hooks'
import { DashboardContext } from '@web/context/DashboardContext'

/**
 * Component to render all map markers
 */
export const Markers: FC = () => {
  // Get the global map instance with the useGoogleMap hook
  const map = useGoogleMap()
  const { gatherList, setSelectedGather, setSelectedPlace, setPlaceModalOpen, setAvailableGathers } =
    useContext(DashboardContext)

  // Handle marker clicks
  const onMarkerClick = useCallback(
    (marker: google.maps.Marker) => {
      const title = marker.getTitle()
      const latLng = marker.getPosition()
      const gathers = gatherList.filter((gather) => {
        return (
          gather.googlePlace.name === title ||
          (gather.googlePlace.lat === latLng?.lat() && gather.googlePlace.lng === latLng?.lng())
        )
      })
      setSelectedPlace(gathers[0]?.googlePlace || null)
      

      if (gathers.length === 0) {
        return
      }
      if (gathers.length === 1) {
        const gather = gathers[0]
        setSelectedGather(gather)
        setPlaceModalOpen(true)
      }
      if (gathers.length > 1) {
        setAvailableGathers(gathers)
        setPlaceModalOpen(true)
      }
    },
    [gatherList, setSelectedGather, setSelectedPlace, setPlaceModalOpen, setAvailableGathers],
  )

  const [, setMarkers] = useState<Array<google.maps.Marker>>([])

  // Add markers to the map
  useEffect(() => {
    if (!map) {
      return () => {}
    }

    const initialBounds = new google.maps.LatLngBounds()

    const gatherMarkers: Array<google.maps.Marker> = gatherList.map((gather: any) => {
      const name = gather.name || gather.googlePlace.name
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

    gatherMarkers.forEach((marker) => {
      marker.addListener('click', () => {
        onMarkerClick(marker)
      })
    })

    setMarkers(gatherMarkers)

    // Clean up markers
    return () => {
      gatherMarkers.forEach((marker) => marker.setMap(null))
    }
  }, [map, gatherList, onMarkerClick])

  return null
}
