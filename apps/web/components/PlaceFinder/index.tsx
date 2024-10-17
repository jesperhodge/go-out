import React, { useEffect, ChangeEvent, useState, useRef, FC } from 'react'
import { useAutocompleteService, useGoogleMap, usePlacesService } from '@ubilabs/google-maps-react-hooks'

import { Gather, Participant, PlaceFinderSuggestion } from '@customTypes/gather'

import './index.css'
import { GatherModal } from '../GatherModal'
import { Search } from '../Search'
import { DashboardContext } from '@web/context/DashboardContext'
import { useClient } from '@web/apiClient'
import { useUser } from '@clerk/nextjs'

const maxNumberOfSuggestions = 5

interface HandleCreateArgs {
  name: string
  description: string
  pictures: string[]
}

const refreshDisplayedEvents = ({
  map,
  setBounds,
  setGatherList,
  getGathersFromBounds,
}: {
  map: google.maps.Map
  setBounds: React.Dispatch<React.SetStateAction<google.maps.LatLngBounds | undefined | null>>
  setGatherList: React.Dispatch<React.SetStateAction<Gather[]>>
  getGathersFromBounds: (bounds: google.maps.LatLngBounds) => Promise<any>
}) => {
  const bounds = map.getBounds()

  if (bounds) {
    setBounds(bounds)
    getGathersFromBounds(bounds).then((gathers) => {
      setGatherList(gathers)
    })
  }
}

const PlaceFinder: FC = () => {
  // Define state and refs
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const { isLoaded, isSignedIn, user } = useUser()

  const [inputValue, setInputValue] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Array<PlaceFinderSuggestion>>([])
  const [suggestionsAreVisible, setSuggestionsAreVisible] = useState<boolean>(false)
  const [, setBounds] = useState<google.maps.LatLngBounds | undefined | null>(null)
  const { getGather, getGathersFromBounds, createGather, joinGather } = useClient()

  const {
    setGatherList,
    selectedPlace,
    setSelectedPlace,
    selectedGather,
    setSelectedGather,
    placeModalOpen,
    setPlaceModalOpen,
  } = React.useContext(DashboardContext)

  // Get google map services
  const map = useGoogleMap()
  const autocompleteService = useAutocompleteService()
  const placesService = usePlacesService()

  useEffect(() => {
    if (map) {
      map.addListener('bounds_changed', () => {
        refreshDisplayedEvents({ map, setBounds, setGatherList, getGathersFromBounds })
      })
    }
  }, [map, setGatherList, setBounds, getGathersFromBounds])

  // Update the user input value
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value
    setInputValue(newInputValue)

    if (newInputValue.length >= 2) {
      autocompleteService?.getPlacePredictions(
        {
          input: newInputValue,
        },
        (
          predictions: google.maps.places.AutocompletePrediction[] | null,
          status: google.maps.places.PlacesServiceStatus,
        ) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            return
          }

          const autocompleteSuggestions = predictions.slice(0, maxNumberOfSuggestions).map((prediction) => ({
            id: prediction.place_id,
            label: prediction.description,
          }))

          // Update suggestions for dropdown suggestions list
          setSuggestions(autocompleteSuggestions)
        },
      )
    } else {
      setSuggestions([])
    }

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    // Show dropdown with a little delay
    timeout.current = setTimeout(() => {
      setSuggestionsAreVisible(true)
    }, 300)
  }

  // TODO: replace the lat/lng stuff with location.toString()!

  // Handle suggestion selection
  const selectSuggestion = (suggestion: PlaceFinderSuggestion) => {
    inputRef.current?.focus()
    setInputValue(suggestion.label)

    // Close dropdown
    setSuggestionsAreVisible(false)

    // Get the location from Places Service of the selected place and zoom to it
    placesService?.getDetails(
      { placeId: suggestion.id },
      async (placeResult: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !placeResult) {
          return
        }

        setSelectedPlace(placeResult)
        setPlaceModalOpen(true)
        const gathers = await getGather(placeResult)
        const gather = gathers[0]

        if (gather) {
          window.alert(JSON.stringify(gather))
          setSelectedGather(gather)
        } else {
          setSelectedGather(null)
        }

        // Get position of the suggestion to move map
        const position = placeResult.geometry?.location

        if (map && position) {
          map.setZoom(14)
          map.panTo(position)
        }
      },
    )
  }

  const handleCreate = async ({ name, description, pictures }: HandleCreateArgs) => {
    if (selectedPlace) {
      const gather = await createGather(selectedPlace, name, description, pictures)
      setSelectedGather(gather)
      if (map) refreshDisplayedEvents({ map, setBounds, setGatherList, getGathersFromBounds })
    }
  }

  const handleJoin = async () => {
    if (!selectedGather?.id || !user) return
    // debugger

    const data = await joinGather(selectedGather.id)

    setSelectedGather({
      ...data,
    })
  }

  return (
    <>
      <Search
        inputRef={inputRef}
        inputValue={inputValue}
        suggestions={suggestions}
        suggestionsAreVisible={suggestionsAreVisible}
        handleInputChange={handleInputChange}
        selectSuggestion={selectSuggestion}
      ></Search>
      {placeModalOpen && (
        <GatherModal
          selectedPlace={selectedPlace}
          selectedGather={selectedGather}
          setModalOpen={setPlaceModalOpen}
          handleCreate={handleCreate}
          handleJoin={handleJoin}
        />
      )}
    </>
  )
}

export default PlaceFinder
