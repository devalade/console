import MainLayout from '@/layouts/main_layout'
import * as React from 'react'
import ChatLeftSidebar from '../components/chat_left_sidebar'
import ChatRightSidebar from '../components/chat_right_sidebar'
import type { Member } from '../types/member'
import type { Channel } from '../types/channel'
import Message from '../components/message'
import SendMessageForm from '../components/send_message_form'
import type { Message as MessageType } from '../types/message'
import type { Conversation } from '../types/conversation'
import useParams from '@/hooks/use_params'
import usePresence from '@/hooks/use_presence'

interface ChatProps {
  channels: Channel[]
  currentChannel: Channel
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: MessageType[]
  members: Member[]
  isOwner: boolean
}

const Chat: React.FunctionComponent<ChatProps> = ({
  currentChannel,
  channels: initialChannels,
  conversations: initialConversations,
  currentConversation,
  messages: initialMessages,
  members,
  isOwner,
}) => {
  const params = useParams()
  const [messages, setMessages] = React.useState(initialMessages)
  const [conversations, setConversations] = React.useState(initialConversations)
  const [channels, setChannels] = React.useState(initialChannels)
  const presence = usePresence()
  const messagesListRef = React.useRef<HTMLUListElement>(null)

  React.useEffect(() => {
    let eventSource: EventSource

    const url = `/organizations/${params.organizationSlug}/updates`

    eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      try {
        const parsedJSON = JSON.parse(event.data)

        /**
         * Handle message creation and update.
         */
        if ('message' in parsedJSON) {
          const { message } = parsedJSON as { message: MessageType }

          /**
           * Only update the message if it is include in the current channel or conversation.
           */
          if (message.channel && currentChannel.slug !== message.channel.slug) {
            return
          }
          if (message.conversation && currentConversation?.id !== message.conversation.id) {
            return
          }

          setMessages((prevMessages) => {
            /**
             * If the message already exists, update it.
             */
            if (prevMessages.find((m) => m.id === message.id)) {
              return prevMessages.map((m) => (m.id === message.id ? message : m))
            }

            /**
             * Else, add it to the list.
             */
            return [...prevMessages, message]
          })
        }

        /**
         * Handle message deletion.
         */
        if ('messageDeleted' in parsedJSON) {
          const { messageDeleted } = parsedJSON as { messageDeleted: MessageType }
          setMessages((prevMessages) => prevMessages.filter((m) => m.id !== messageDeleted.id))
        }

        /**
         * Handle conversation creation.
         */
        if ('conversation' in parsedJSON) {
          const { conversation } = parsedJSON as { conversation: Conversation }
          setConversations((prevConversations) => [...prevConversations, conversation])
        }

        /**
         * Handle channel creation and update.
         */
        if ('channel' in parsedJSON) {
          const { channel } = parsedJSON as { channel: Channel }
          if (channels.find((c) => c.id === channel.id)) {
            /**
             * If the channel already exists, update it.
             */
            setChannels(channels.map((c) => (c.id === channel.id ? channel : c)))

            return
          }
          setChannels((prevChannels) => [...prevChannels, channel])
        }

        /**
         * Handle channel deletion.
         */
        if ('channelDeleted' in parsedJSON) {
          const { channelDeleted } = parsedJSON as { channelDeleted: Channel }
          setChannels((prevChannels) => prevChannels.filter((c) => c.id !== channelDeleted.id))

          /**
           * If the current channel was deleted, redirect to /chat.
           */
          if (currentChannel.id === channelDeleted.id) {
            window.location.href = `/organizations/${params.organizationSlug}/chat`
          }
        }
      } catch {}
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  /**
   * Scroll to the bottom of the messages list when the messages change.
   */
  React.useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight
    }
  }, [messages])

  return (
    <MainLayout className="!p-0">
      <div className="flex  min-h-[calc(100vh-64px)]">
        <ChatLeftSidebar
          channels={channels}
          currentChannel={currentChannel}
          conversations={conversations}
          currentConversation={currentConversation}
          messages={messages}
          members={members}
          isOwner={isOwner}
        />

        <div className="px-4 py-6 md:col-span-4 flex flex-col-reverse w-full max-h-[calc(100vh-64px)]">
          {(currentChannel || currentConversation) && (
            <SendMessageForm
              currentChannel={currentChannel}
              currentConversation={currentConversation}
            />
          )}
          <ul
            className="list-none p-0 mb-4 m-0 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto"
            ref={messagesListRef}
          >
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ul>
        </div>

        <ChatRightSidebar members={members} />
      </div>
    </MainLayout>
  )
}

export default Chat
