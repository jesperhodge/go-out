import React from 'react'

export function GatherModal(props) {
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
          props.setModalOpen(false)
        }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <h2 className="text-xl font-bold mb-3">Create or Join an event</h2>
      <div className="flex flex-row justify-center gap-8">
        <div>
          <b>{props.selectedPlace?.name}</b>
          <p>{props.selectedPlace?.formatted_address}</p>
          {props.selectedPlace && (
            <button
              className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
              onClick={props.handleCreate}
            >
              Create
            </button>
          )}
        </div>
        {props.selectedGather && (
          <div>
            <b>selectedGather</b>
            <p>
              Name:{' '}
              {props.selectedGather?.name || props.selectedGather?.googlePlace?.name}
            </p>
            <p>Location: {props.selectedGather?.googlePlace?.formatted_address}</p>
            <b>Participants</b>
            {props.selectedGather?.participants?.map((participant, i) => (
              <p key={`gather-participants-${participant?.name}-${i}`}>
                {participant.name}
              </p>
            ))}
            <button
              className="inline-flex justify-center rounded-lg text-sm font-semibold py-3 px-4 bg-slate-900 text-white hover:bg-slate-700"
              onClick={props.handleJoin}
            >
              Join
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
