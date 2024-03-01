import { IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react'
import * as React from 'react'
import CreateChannelDialog from './create_channel_dialog'
import type { Channel as ChannelType } from '../types/channel'
import clsx from 'clsx'
import useParams from '@/hooks/use_params'
import { Link, router } from '@inertiajs/react'
import type { Member } from '../types/member'
import type { Message } from '../types/message'
import type { Conversation } from '../types/conversation'
import Channel from './channel'
import Avatar from '@/components/avatar'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useChatUpdates from '../hooks/use_chat_updates'

interface ChatLeftSidebarProps {
  currentChannel: ChannelType | null
  currentConversation: Conversation | null
  members: Member[]
  isOwner: boolean
}

const ChatLeftSidebar: React.FunctionComponent<ChatLeftSidebarProps> = ({
  currentConversation,
  currentChannel,
  isOwner,
}) => {
  const [open, setOpen] = React.useState(false)
  const [channelsShow, setChannelsShow] = React.useState(true)
  const [directMessagesShow, setDirectMessagesShow] = React.useState(true)
  const params = useParams()
  const { channels, setChannels, conversations } = useChatUpdates()

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const oldOrder = channels[result.source.index].order
    const channel = channels[result.source.index]
    const order = channels[result.destination.index].order

    let newOrderedChannels: ChannelType[] = []

    channels.forEach((ch) => {
      if (ch.slug === channel.slug) {
        // Update the order of the moved channel
        ch.order = order
      } else if (order > oldOrder) {
        // Shift channels down
        if (ch.order > oldOrder && ch.order <= order) {
          ch.order -= 1
        }
      } else {
        // Shift channels up
        if (ch.order >= order && ch.order < oldOrder) {
          ch.order += 1
        }
      }
      newOrderedChannels.push(ch)
    })

    setChannels(newOrderedChannels)

    router.patch(
      `/organizations/${params.organizationSlug}/channels/${channel.slug}/move${window.location.search}`,
      { order },
      { preserveScroll: true, preserveState: true }
    )
  }

  return (
    <>
      <CreateChannelDialog open={open} setOpen={setOpen} />
      <div className="bg-white min-w-64 border-r border-zinc-200 px-8 py-5 space-y-8">
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
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="channels" isDropDisabled={!isOwner}>
                {(provided) => (
                  <ul
                    className="my-4 space-y-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {channels
                      .sort((a, b) => a.order - b.order)
                      .map((channel, index) => (
                        <Draggable key={channel.id} draggableId={channel.slug} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Channel
                                channel={channel}
                                currentChannel={currentChannel}
                                isOwner={isOwner}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
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
                    <Avatar user={conversation.user} />
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
