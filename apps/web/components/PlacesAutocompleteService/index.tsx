import React, { FunctionComponent, ChangeEvent, useState, useRef, useEffect } from 'react'
import { useAutocompleteService, useGoogleMap, usePlacesService } from '@ubilabs/google-maps-react-hooks'

import { Gather, Participant, PlacesAutocompleteServiceSuggestion } from '@customTypes/gather'

import './index.css'

const maxNumberOfSuggestions = 5
const user: Participant = {
  name: 'Jesper Hodge',
}
const baseUrl = 'http://localhost:8080'

const PlacesAutocompleteService: FunctionComponent<Record<string, unknown>> = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const [inputValue, setInputValue] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Array<PlacesAutocompleteServiceSuggestion>>([])
  const [suggestionsAreVisible, setSuggestionsAreVisible] = useState<boolean>(false)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)

  const map = useGoogleMap()
  const autocompleteService = useAutocompleteService()
  const placesService = usePlacesService()

  const [closeGathers, setCloseGathers] = useState<Gather[]>([])
  const [selectedGather, setSelectedGather] = useState<Gather | null>(null)

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

  const encodeParams = (params: Record<string, any>): string => {
    return Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  }

  const getGather = async (googlePlace: google.maps.places.PlaceResult) => {
    const params = {
      googleId: googlePlace.place_id,
      lat: googlePlace.geometry?.location?.lat(),
      lng: googlePlace.geometry?.location?.lng(),
    }
    const queryString = encodeParams(params)
    const response = await fetch(`${baseUrl}/api/gathers?${queryString}`)
    const data = await response.json()
    return data
  }

  const createGather = async (googlePlace: google.maps.places.PlaceResult) => {
    const params = {
      googleId: googlePlace.place_id,
      lat: googlePlace.geometry?.location?.lat(),
      lng: googlePlace.geometry?.location?.lng(),
    }
    const queryString = encodeParams(params)
    const newGather: Gather = {
      name: googlePlace.name,
      location: {
        googleId: googlePlace.place_id,
        lat: googlePlace.geometry?.location?.lat() || 0,
        lng: googlePlace.geometry?.location?.lng() || 0,
      },
      participants: [user],
    }

    const response = await fetch(`${baseUrl}/api/gathers`, {
      method: 'POST',
      body: JSON.stringify(newGather),
    })
    const data = await response.json()

    return data
  }

  const joinGather = async (gatherId: string, newParticipant: Participant) => {
    const response = await fetch(`${baseUrl}/api/gathers/${gatherId}/participants`, {
      method: 'POST',
      body: JSON.stringify(newParticipant),
    })
    const data = await response.json()
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
      async (placeResult: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !placeResult) {
          return
        }

        setSelectedPlace(placeResult)
        const gather = await getGather(placeResult)
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

  function isGather(place: google.maps.places.PlaceResult): place is Gather {
    // check if selected place google place id is selectedGather id
    return selectedGather?.location?.googleId === place.place_id
  }

  const handleCreate = async () => {
    if (selectedPlace) {
      const gather = await createGather(selectedPlace)
      setSelectedGather(gather)
    }
  }

  const handleJoin = async () => {
    if (!selectedGather?.id || !user) return

    await joinGather(selectedGather.id, user)

    setSelectedGather({
      ...selectedGather,
      participants: [...selectedGather?.participants, user],
    })
  }

  return (
    <>
      <label htmlFor="places-search-autocomplete">Search for a location:</label>
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
        <ul className="suggestions" id="search-suggestions" role="listbox" aria-label="Suggested locations:">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => selectSuggestion(suggestion)} id={suggestion.id}>
              <span>{suggestion.label}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="app-box flex flex-row justify-center gap-8">
        <div>
          <b>{selectedPlace?.name}</b>
          <p>{selectedPlace?.formatted_address}</p>
          {/* {!selectedGather && selectedPlace && */}
          {true && (
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
            <p>Name: {selectedGather?.name || selectedGather?.location?.name}</p>
            <p>Location: {selectedGather?.location?.formattedAddress}</p>
            <b>Participants</b>
            {selectedGather?.participants.map((participant, i) => (
              <p key={`gather-participants-${participant?.name}-${i}`}>{participant.name}</p>
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
    </>
  )
}

export default PlacesAutocompleteService
