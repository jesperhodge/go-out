export interface PlacesAutocompleteServiceSuggestion {
  id: string;
  label: string;
}

interface Participant {
  id?: string;
  name: string;
}

interface GatherLocation {
  googleId?: string;
  name?: string;
  formattedAddress?: string;
  lat: number;
  lng: number;
}

interface Gather {
  id?: string;
  name?: string;
  location: GatherLocation;
  participants: Participant[];
}