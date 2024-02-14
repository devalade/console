import { IconChevronDown, IconChevronUp, IconHash, IconPlus } from '@tabler/icons-react'
import * as React from 'react'
import CreateChannelDialog from './create_channel_dialog'
import type { Channel } from '../types/channel'
import clsx from 'clsx'
import useParams from '@/hooks/use_params'
import { Link } from '@inertiajs/react'
import type { Member } from '../types/member'
import type { User } from '~/types/user'
import getInitials from '@/lib/initials'
import type { Message } from '../types/message'
import type { Conversation } from '../types/conversation'

interface ChatLeftSidebarProps {
  channels: Channel[]
  currentChannel: Channel | null
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Array<Message>
  members: Member[]
  isOwner: boolean
}

const ChatLeftSidebar: React.FunctionComponent<ChatLeftSidebarProps> = ({
  currentConversation,
  conversations,
  currentChannel,
  channels,
  isOwner,
}) => {
  const [open, setOpen] = React.useState(false)
  const [channelsShow, setChannelsShow] = React.useState(true)
  const [directMessagesShow, setDirectMessagesShow] = React.useState(true)
  const params = useParams()

  return (
    <>
      <CreateChannelDialog open={open} setOpen={setOpen} />
      <div className="bg-white col-span-1 border-r border-zinc-200 px-8 py-5 space-y-8">
        <div>
          <h2 className="font-medium text-sm flex items-center">
            {channelsShow ? (
              <IconChevronDown
                className="h-4 w-4 inline-block mr-2 text-zinc-700 cursor-pointer"
                onClick={() => setChannelsShow(false)}
              />
            ) : (
              <IconChevronUp
                className="h-4 w-4 inline-block mr-2 text-zinc-700 cursor-pointer"
                onClick={() => setChannelsShow(true)}
              />
            )}
            <span>Channels</span>
            {isOwner && (
              <IconPlus
                className="h-4 w-4 inline-block ml-auto text-zinc-700 cursor-pointer"
                onClick={() => setOpen(true)}
              />
            )}
          </h2>
          {channelsShow && (
            <ul className="my-4 space-y-3">
              {channels.map((channel) => (
                <Link
                  href={`/organizations/${params.organizationSlug}/chat?channel=${channel.slug}`}
                  key={channel.id}
                >
                  <li
                    className={clsx(
                      'flex items-center px-2 py-[6px] rounded-sm cursor-pointer text-[13px] mb-2',
                      currentChannel?.slug === channel.slug ? 'bg-accent' : 'hover:bg-zinc-50'
                    )}
                  >
                    <IconHash className="h-4 w-4 inline-block mr-2 text-zinc-700" />
                    <span>{channel.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-medium text-sm flex items-center">
            {directMessagesShow ? (
              <IconChevronDown
                className="h-4 w-4 inline-block mr-2 text-zinc-700 cursor-pointer"
                onClick={() => setDirectMessagesShow(false)}
              />
            ) : (
              <IconChevronUp
                className="h-4 w-4 inline-block mr-2 text-zinc-700 cursor-pointer"
                onClick={() => setDirectMessagesShow(true)}
              />
            )}
            <span>Direct Messages</span>
          </h2>
          {directMessagesShow && (
            <ul className="my-4 space-y-3">
              {conversations.map((conversation) => (
                <Link
                  href={`/organizations/${params.organizationSlug}/chat?conversationId=${conversation.id}`}
                  key={conversation.id}
                >
                  <li
                    className={clsx(
                      'flex items-center space-x-2 px-2 py-[6px] rounded-sm cursor-pointer text-[13px] mb-2',
                      currentConversation?.id === conversation.id ? 'bg-accent' : 'hover:bg-zinc-50'
                    )}
                  >
                    <div className="flex h-7 w-7 text-sm items-center justify-center rounded-full bg-zinc-800 border-zinc-700 border text-zinc-200">
                      <span className="text-sm">{getInitials(conversation.user.fullName)}</span>
                    </div>
                    <span>{conversation.user.fullName}</span>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default ChatLeftSidebar
