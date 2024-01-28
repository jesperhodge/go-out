import { GatherGallery } from '@web/components/GatherGallery'
import { FC } from 'react'

interface Props {}

const Dashboard: FC<Props> = () => {
  return (
    <>
      <h1 className="mt-4 mb-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
        Upcoming Events
      </h1>
      <hr className="w-100 h-1 bg-slate-200" />
      <GatherGallery gatherList={[]} />
    </>
  )
}

export default Dashboard
