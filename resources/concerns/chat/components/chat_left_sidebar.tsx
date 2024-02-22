import { IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react'
import * as React from 'react'
import CreateChannelDialog from './create_channel_dialog'
import type { Channel as ChannelType } from '../types/channel'
import clsx from 'clsx'
import useParams from '@/hooks/use_params'
import { Link } from '@inertiajs/react'
import type { Member } from '../types/member'
import type { Message } from '../types/message'
import type { Conversation } from '../types/conversation'
import Channel from './channel'
import Avatar from '@/components/avatar'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface ChatLeftSidebarProps {
  channels: ChannelType[]
  currentChannel: ChannelType | null
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

  const handleDragEnd = (result) => {
    if (!result.destination) return
    // Reorder channels array according to the drag and drop result
    const reorderedChannels = Array.from(channels)
    const [removed] = reorderedChannels.splice(result.source.index, 1)
    reorderedChannels.splice(result.destination.index, 0, removed)
    // Update state with the new order
    // setState(reorderedChannels);
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
              <Droppable droppableId="channels">
                {(provided) => (
                  <ul
                    className="my-4 space-y-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {channels.map((channel, index) => (
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
