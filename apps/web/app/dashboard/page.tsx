import { FC } from 'react'

interface Props {}

const Dashboard: FC<Props> = () => {
  return (
    <h1 className="mt-8 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
      Dashboard
    </h1>
  )
}

export default Dashboard
