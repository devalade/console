import useParams from '@/hooks/use_params'
import * as React from 'react'
import type { Channel } from '../types/channel'
import type { Conversation } from '../types/conversation'
import type { Message as MessageType } from '../types/message'

const useChatUpdates = ({
  currentConversation,
  currentChannel,
  initialChannels,
  initialConversations,
  initialMessages,
}: {
  currentConversation: Conversation | null
  currentChannel: Channel
  initialChannels: Channel[]
  initialConversations: Conversation[]
  initialMessages: MessageType[]
}) => {
  const [messages, setMessages] = React.useState(initialMessages)
  const [conversations, setConversations] = React.useState(initialConversations)
  const [channels, setChannels] = React.useState(initialChannels)
  const params = useParams()

  React.useEffect(() => {
    let eventSource: EventSource

    const url = `/organizations/${params.organizationSlug}/chat/updates`

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
  }, [window.location.pathname])

  return {
    messages,
    conversations,
    channels,
  }
}

export default useChatUpdates
