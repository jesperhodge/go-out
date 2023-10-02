export interface PlacesAutocompleteServiceSuggestion {
  id: string
  label: string
}

export interface Participant {
  id?: string
  name: string
}

export interface GatherLocation {
  googleId?: string
  location?: string
  name?: string
  formattedAddress?: string
}

export interface Gather {
  id?: string
  name?: string
  gatherLocation: GatherLocation
  participants: Participant[]
}
