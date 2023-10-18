import React, { ChangeEvent, useState, useRef, FC } from 'react'
import {
  useAutocompleteService,
  useGoogleMap,
  usePlacesService,
} from '@ubilabs/google-maps-react-hooks'

import {
  Gather,
  Participant,
  PlacesAutocompleteServiceSuggestion,
} from '@customTypes/gather'

import './index.css'

const maxNumberOfSuggestions = 5
const user: Participant = {
  id: 2,
  name: 'Jesper Hodge',
}
const baseUrl = 'http://localhost:4000'

const PlacesAutocompleteService: FC<Record<string, unknown>> = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const [inputValue, setInputValue] = useState<string>('')
  const [suggestions, setSuggestions] = useState<
    Array<PlacesAutocompleteServiceSuggestion>
  >([])
  const [suggestionsAreVisible, setSuggestionsAreVisible] = useState<boolean>(false)
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null)

  const map = useGoogleMap()
  const autocompleteService = useAutocompleteService()
  const placesService = usePlacesService()

  const [selectedGather, setSelectedGather] = useState<Gather | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

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

          const autocompleteSuggestions = predictions
            .slice(0, maxNumberOfSuggestions)
            .map((prediction) => ({
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

  const encodeParams = (params: Record<string, any>): string => {
    return Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  }

  // TODO: replace the lat/lng stuff with location.toString()!
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

  // Handle suggestion selection
  const selectSuggestion = (suggestion: PlacesAutocompleteServiceSuggestion) => {
    inputRef.current?.focus()
    setInputValue(suggestion.label)

    // Close dropdown
    setSuggestionsAreVisible(false)

    // Get the location from Places Service of the selected place and zoom to it
    placesService?.getDetails(
      { placeId: suggestion.id },
      async (
        placeResult: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus,
      ) => {
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

  const handleCreate = async () => {
    console.log('selectedPlace: ', selectedPlace)
    if (selectedPlace) {
      const gather = await createGather(selectedPlace)
      setSelectedGather(gather)
    }
  }

  const handleJoin = async () => {
    if (!selectedGather?.id || !user) return

    const data = await joinGather(selectedGather.id, user)

    setSelectedGather({
      ...data,
    })
  }

  return (
    <>
      <input
        ref={inputRef}
        className="searchInput"
        value={inputValue}
        onChange={handleInputChange}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-expanded={suggestionsAreVisible}
        id="places-search-autocomplete"
      />

      {suggestionsAreVisible && (
        <ul
          className="suggestions"
          id="search-suggestions"
          role="listbox"
          aria-label="Suggested locations:"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => selectSuggestion(suggestion)}
              id={suggestion.id}
            >
              <span>{suggestion.label}</span>
            </li>
          ))}
        </ul>
      )}
      {modalOpen && (
        <div className="gather-modal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute top-4 right-4"
            onClick={() => {
              setModalOpen(false)
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="text-xl font-bold mb-3">Create or Join an event</h2>
          <div className="flex flex-row justify-center gap-8">
            <div>
              <b>{selectedPlace?.name}</b>
              <p>{selectedPlace?.formatted_address}</p>
              {selectedPlace && (
                <button
                  className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
                  onClick={handleCreate}
                >
                  Create
                </button>
              )}
            </div>
            {selectedGather && (
              <div>
                <b>selectedGather</b>
                <p>Name: {selectedGather?.name || selectedGather?.googlePlace?.name}</p>
                <p>Location: {selectedGather?.googlePlace?.formatted_address}</p>
                <b>Participants</b>
                {selectedGather?.participants?.map((participant, i) => (
                  <p key={`gather-participants-${participant?.name}-${i}`}>
                    {participant.name}
                  </p>
                ))}
                <button
                  className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
                  onClick={handleJoin}
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default PlacesAutocompleteService
