import { Gather } from '@customTypes/gather'
import { DashboardContext } from '@web/context/DashboardContext'
import React, { FC, useContext, useState } from 'react'

interface Props {
  setModalOpen: (open: boolean) => void
  selectedPlace: google.maps.places.PlaceResult | null
  selectedGather: Gather | null
  handleCreate: (_: { name: string; description: string; pictures: string[] }) => void
  handleJoin: () => void
}
export const GatherModal: FC<Props> = ({ setModalOpen, selectedPlace, selectedGather, handleCreate, handleJoin }) => {
  const [name, setName] = useState<string | null>(null)
  const [description, setDescription] = useState<string>('')
  const [pictures, setPictures] = useState<string[]>([])
  const [valid, setValid] = useState<boolean | null>(null)
  const { availableGathers, setSelectedGather } = useContext(DashboardContext)

  const handleClick = () => {
    if (!selectedPlace) {
      return
    }

    if (!name) {
      setValid(false)
      return
    }

    handleCreate({ name, description, pictures })
  }

  return (
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
            <>
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value)
                }}
                placeholder="Event Name"
                className={`border ${valid === false ? 'border-red-600' : 'border-slate-400'} mb-4`}
              />
              {/* input field for description */}
              <input
                type="text"
                onChange={(e) => {
                  setDescription(e.target.value)
                }}
                placeholder="Description"
                className={`border ${valid === false ? 'border-red-600' : 'border-slate-400'} mb-4`}
              />
              {/* input field picture as url string */}
              <input
                type="text"
                onChange={(e) => {
                  setPictures([e.target.value])
                }}
                placeholder="Pictures"
                className={`border ${valid === false ? 'border-red-600' : 'border-slate-400'} mb-4`}
              />
              <button
                className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
                onClick={handleClick}
              >
                Create
              </button>
            </>
          )}
        </div>
        {!selectedGather && availableGathers.length > 0 && (
          <div>
            <b>availableGathers</b>
            {availableGathers.map((gather, i) => (
              <div key={`gather-${gather?.name}-${i}`}>
                <p>Name: {gather?.name || gather?.googlePlace?.name}</p>
                <p>Location: {gather?.googlePlace?.formatted_address}</p>
                <button
                  className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
                  onClick={() => {
                    setSelectedGather(gather)
                  }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}
        {selectedGather && (
          <div>
            <b>selectedGather</b>
            <p>Name: {selectedGather?.name || selectedGather?.googlePlace?.name}</p>
            <p>Location: {selectedGather?.googlePlace?.formatted_address}</p>
            <b>Participants</b>
            {selectedGather?.participants?.map((participant, i) => (
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
    </div>
  )
}
