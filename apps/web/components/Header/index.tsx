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
          <Link href="/dashboard" className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </Link>

          <button className="w-8 h-8 bg-neutral-100 rounded-full"></button>
          <button className="w-8 h-8 bg-neutral-100 rounded-full"></button>
        </div>
      </div>
    </div>
  </>
)
