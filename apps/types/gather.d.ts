export interface PlacesAutocompleteServiceSuggestion {
  id: string
  label: string
}

export interface Participant {
  id?: number
  name: string
}

export interface GatherLocation {
  googleId?: string
  location?: string
  name?: string
  formatted_address?: string
}

export interface Gather {
  id?: string
  name?: string
  googlePlace: GatherLocation
  participants: Participant[]
}
