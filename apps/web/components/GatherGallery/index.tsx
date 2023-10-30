import { Gather } from '@customTypes/gather'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  gatherList: Gather[]
}

export const GatherGallery: FC<Props> = ({ gatherList }) => {
  console.log('gatherList: ', gatherList)
  return (
    <div className="text-center mb-24 flex flex-col items-center">
      <h3 className="bold text-xl mb-12 mt-8">Events found</h3>
      <div className="grid gap-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {gatherList?.map((gather) => {
          return (
            <div key={gather.id} className="w-64 h-64 border border-slate-400 mb-8">
              <Image
                src="https://loremflickr.com/256/144"
                alt="Gather Image"
                className="object-contain"
                width={256}
                height={144}
              />
              <h4 className="text-lg text-slate-900 mb-8">{gather.name}</h4>
              <p className="text-slate-900 break-all">
                {gather?.googlePlace?.formatted_address || 'no address'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
