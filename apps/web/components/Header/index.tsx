import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { FC } from 'react'

interface Props {}

export const Header: FC<Props> = () => (
  <>
    <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 h-12">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex flex-row items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          <h1 className="text-xl font-bold">Go Out</h1>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 bg-neutral-100 rounded-full"></Link>
          <button className="w-8 h-8 bg-neutral-100 rounded-full"></button>
          <button className="w-8 h-8 bg-neutral-100 rounded-full"></button>
        </div>
      </div>
    </div>
  </>
)
