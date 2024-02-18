import { Link } from '@inertiajs/react'
import * as React from 'react'
import type { Channel as ChannelType } from '../types/channel'
import useParams from '@/hooks/use_params'
import clsx from 'clsx'
import { IconHash, IconSettings } from '@tabler/icons-react'

interface ChannelProps {
  channel: ChannelType
  currentChannel: ChannelType
  isOwner: boolean
}

const Channel: React.FunctionComponent<ChannelProps> = ({ channel, currentChannel }) => {
  const params = useParams()
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Link
      href={`/organizations/${params.organizationSlug}/chat?channel=${channel.slug}`}
      key={channel.id}
    >
      <li
        className={clsx(
          'flex items-center px-2 py-[6px] rounded-sm cursor-pointer text-[13px] mb-2',
          currentChannel?.slug === channel.slug ? 'bg-accent' : 'hover:bg-zinc-50'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconHash className="h-4 w-4 inline-block mr-2 text-zinc-700" />
        <span>{channel.name}</span>
        {isHovered && (
          <IconSettings
            className="h-4 w-4 inline-block ml-auto text-zinc-700"
            onClick={() => {
              alert('here')
            }}
          />
        )}
      </li>
    </Link>
  )
}

export default Channel
