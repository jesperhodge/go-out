export interface PlaceFinderSuggestion {
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
  lat?: number
  lng?: number
}

export interface Gather {
  id?: string
  name?: string
  googlePlace: GatherLocation
  participants?: Participant[]
  description?: string
  pictures?: string[]
}
