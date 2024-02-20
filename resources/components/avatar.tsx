import usePresence from '@/hooks/use_presence'
import getInitials from '@/lib/initials'
import clsx from 'clsx'
import * as React from 'react'
import type { User } from '~/types/user'

interface AvatarProps {
  user: User
}

const Avatar: React.FunctionComponent<AvatarProps> = ({ user }) => {
  const presence = usePresence()
  const isOnline = presence.includes(user.id)
  return (
    <span className="relative inline-block">
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border-zinc-700 border text-zinc-200">
          <span className="font-medium">{getInitials(user.fullName)}</span>
        </div>
      </div>
      <span className="absolute bottom-1 right-1 block translate-x-1/2 translate-y-1/2 transform rounded-full border-2 border-white">
        <span
          className={clsx(
            'block h-[7px] w-[7px] rounded-full',
            isOnline ? 'bg-emerald-500' : 'bg-red-500'
          )}
        />
      </span>
    </span>
  )
}

export default Avatar
