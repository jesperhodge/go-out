import { Gather } from '@customTypes/gather'
import { Dispatch, SetStateAction, createContext } from 'react'

export const DashboardContext = createContext<{
  gatherList: Gather[]
  setGatherList: Dispatch<SetStateAction<Gather[]>>
  selectedPlace: google.maps.places.PlaceResult | null
  setSelectedPlace: Dispatch<SetStateAction<google.maps.places.PlaceResult | null>>
  selectedGather: Gather | null
  setSelectedGather: Dispatch<SetStateAction<Gather | null>>
  placeModalOpen: boolean
  setPlaceModalOpen: Dispatch<SetStateAction<boolean>>
}>({
  gatherList: [],
  setGatherList: () => {},
  selectedPlace: null,
  setSelectedPlace: () => {},
  selectedGather: null,
  setSelectedGather: () => {},
  placeModalOpen: false,
  setPlaceModalOpen: () => {},
})
