import { Link } from '@inertiajs/react'
import * as React from 'react'
import type { Channel as ChannelType } from '../types/channel'
import useParams from '@/hooks/use_params'
import clsx from 'clsx'
import { IconHash, IconSettings, IconTrash } from '@tabler/icons-react'
import EditChannelDialog from './edit_channel_dialog'
import DeleteChannelDialog from './delete_channel_dialog'

interface ChannelProps {
  channel: ChannelType
  currentChannel: ChannelType
  isOwner: boolean
}

const Channel: React.FunctionComponent<ChannelProps> = ({ channel, currentChannel, isOwner }) => {
  const params = useParams()
  const [isHovered, setIsHovered] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  return (
    <>
      <EditChannelDialog channel={channel} open={isEditing} setOpen={setIsEditing} />
      <DeleteChannelDialog channel={channel} open={isDeleting} setOpen={setIsDeleting} />

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
          {isHovered && isOwner && (
            <div className="ml-auto flex items-center space-x-2">
              <IconSettings
                className="h-4 w-4 inline-block ml-auto text-zinc-700"
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditing(true)
                }}
              />
              <IconTrash
                className="h-4 w-4 inline-block text-red-500"
                onClick={(e) => {
                  e.preventDefault()
                  setIsDeleting(true)
                }}
              />
            </div>
          )}
        </li>
      </Link>
    </>
  )
}

export default Channel
