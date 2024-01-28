import { Gather } from '@customTypes/gather'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  gatherList: Gather[]
}

export const GatherGallery: FC<Props> = ({ gatherList }) => {
  return (
    <div className="text-center mb-24 flex flex-col items-center">
      <div className="grid gap-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {gatherList?.map((gather) => {
          return (
            <div key={gather.id} className="w-64 h-64 border border-slate-400 mb-8">
              <img
                src={gather.pictures?.[0] || 'https://loremflickr.com/256/144'}
                alt="Gather Image"
                className="object-contain max-h-32 w-full bg-black"
                width={256}
                height={144}
              />
              <h4 className="text-xl text-slate-900 mb-4 mt-4">{gather.name}</h4>
              <p className="text-slate-900 text-sm break-all truncate max-w-100 mb-2">
                {gather?.googlePlace?.formatted_address || 'no address'}
              </p>
              <p className="text-slate-900 text-sm break-all overflow-ellipsis">{gather?.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
