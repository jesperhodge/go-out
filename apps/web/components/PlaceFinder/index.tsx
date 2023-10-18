import React, { ChangeEvent, useState, useRef, FC } from 'react'
import { useAutocompleteService, useGoogleMap, usePlacesService } from '@ubilabs/google-maps-react-hooks'

import { Gather, Participant, PlaceFinderSuggestion } from '@customTypes/gather'

import './index.css'
import { GatherModal } from '../GatherModal'
import { Search } from '../Search'

const maxNumberOfSuggestions = 5
const user: Participant = {
  id: 2,
  name: 'Jesper Hodge',
}
const baseUrl = 'http://localhost:4000'

const encodeParams = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
}

const getGather = async (googlePlace: google.maps.places.PlaceResult) => {
  const params = {
    googleId: googlePlace.place_id,
    location: googlePlace.geometry?.location?.toString(),
  }
  const queryString = encodeParams(params)
  const response = await fetch(`${baseUrl}/gathers?${queryString}`)
  console.log('getGather response: ', response)
  const data = await response.json()
  console.log('getGather data: ', data)
  return data
}

const createGather = async (googlePlace: google.maps.places.PlaceResult) => {
  console.log('createGather googlePlace: ', googlePlace)
  const name = 'Test Name'

  const newGather: Gather = {
    name,
    googlePlace: {
      googleId: googlePlace.place_id,
      location: googlePlace.geometry?.location?.toString(),
      name: googlePlace.name,
      formatted_address: googlePlace.formatted_address,
    },
    participants: [user],
  }

  console.log('body: ', JSON.stringify({ gather: newGather }))

  const response = await fetch(`${baseUrl}/gathers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gather: newGather }),
  })
  console.log('createGather response: ', response)
  const data = await response.json()
  console.log('createGather data: ', data)

  return data
}

const joinGather = async (gatherId: string, newParticipant: Participant) => {
  const response = await fetch(`${baseUrl}/gathers/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gatherId: gatherId, userId: newParticipant.id }),
  })
  console.log('joinGather response: ', response)
  const data = await response.json()
  console.log('joinGather data: ', data)
  return data
}

interface HandleInputChangeArgs {
  setInputValue: (value: string) => void
  setSuggestions: (suggestions: Array<PlaceFinderSuggestion>) => void
  setSuggestionsAreVisible: (suggestionsAreVisible: boolean) => void
  autocompleteService: google.maps.places.AutocompleteService | null
  timeout: React.MutableRefObject<NodeJS.Timeout | null>
}
const handleInputChange = (
  event: ChangeEvent<HTMLInputElement>,
  { setInputValue, setSuggestions, setSuggestionsAreVisible, autocompleteService, timeout }: HandleInputChangeArgs,
) => {
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

interface HandleSelectSuggestionArgs {
  setInputValue: (value: string) => void
  setSuggestionsAreVisible: (suggestionsAreVisible: boolean) => void
  placesService: google.maps.places.PlacesService | null
  map: google.maps.Map | null
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  setSelectedPlace: (place: google.maps.places.PlaceResult | null) => void
  setModalOpen: (modalOpen: boolean) => void
  setSelectedGather: (gather: Gather | null) => void
}
const handleSelectSuggestion = (
  s: unknown,
  {
    setInputValue,
    setSuggestionsAreVisible,
    placesService,
    map,
    inputRef,
    setSelectedPlace,
    setModalOpen,
    setSelectedGather,
  }: HandleSelectSuggestionArgs,
) => {
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
      setModalOpen(true)
      const gathers = await getGather(placeResult)
      const gather = gathers[0]

      if (gather) {
        window.alert(JSON.stringify(gather))
        setSelectedGather(gather)
      } else {
        setSelectedGather(null)
      }

      console.log('placeResult: ', placeResult)

      // Get position of the suggestion to move map
      const position = placeResult.geometry?.location

      if (map && position) {
        map.setZoom(14)
        map.panTo(position)
      }
    },
  )
}

const handleCreate = async ({
  selectedPlace,
  setSelectedGather,
}: {
  selectedPlace: google.maps.places.PlaceResult | null
  setSelectedGather: (gather: Gather | null) => void
}) => {
  console.log('selectedPlace: ', selectedPlace)
  if (selectedPlace) {
    const gather = await createGather(selectedPlace)
    setSelectedGather(gather)
  }
}

const handleJoin = async ({
  selectedGather,
  setSelectedGather,
}: {
  selectedGather: Gather | null
  setSelectedGather: (gather: Gather | null) => void
}) => {
  if (!selectedGather?.id || !user) return

  const data = await joinGather(selectedGather.id, user)

  setSelectedGather({
    ...data,
  })
}

const PlaceFinder: FC<Record<string, unknown>> = () => {
  // Define state and refs
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const [inputValue, setInputValue] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Array<PlaceFinderSuggestion>>([])
  const [suggestionsAreVisible, setSuggestionsAreVisible] = useState<boolean>(false)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [selectedGather, setSelectedGather] = useState<Gather | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  // Get google map services
  const map = useGoogleMap()
  const autocompleteService = useAutocompleteService()
  const placesService = usePlacesService()

  return (
    <>
      <Search
        inputRef={inputRef}
        inputValue={inputValue}
        suggestions={suggestions}
        suggestionsAreVisible={suggestionsAreVisible}
        handleInputChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleInputChange(e, {
            setInputValue,
            setSuggestions,
            setSuggestionsAreVisible,
            autocompleteService,
            timeout,
          })
        }}
        selectSuggestion={(s) => {
          handleSelectSuggestion(s, {
            setInputValue,
            setSuggestionsAreVisible,
            placesService,
            map: map || null,
            inputRef,
            setSelectedPlace,
            setModalOpen,
            setSelectedGather,
          })
        }}
      ></Search>
      {modalOpen && (
        <GatherModal
          selectedPlace={selectedPlace}
          selectedGather={selectedGather}
          setModalOpen={setModalOpen}
          handleCreate={() => handleCreate({ selectedPlace, setSelectedGather })}
          handleJoin={() => handleJoin({ selectedGather, setSelectedGather })}
        />
      )}
    </>
  )
}

export default PlaceFinder
