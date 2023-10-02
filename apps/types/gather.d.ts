export interface PlacesAutocompleteServiceSuggestion {
  id: string
  label: string
}

export interface Participant {
  id?: string
  name: string
}

export interface GatherLocation {
  googleId: string
  name?: string
  formattedAddress?: string
  lat: number
  lng: number
}

export interface Gather {
  id?: string
  name?: string
  location: GatherLocation
  participants: Participant[]
}
