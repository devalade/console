import * as React from 'react'
import type { Channel } from './types/channel'
import type { Conversation } from './types/conversation'
import type { Message as MessageType } from './types/message'
import usePageProps from '@/hooks/use_page_props'
import useParams from '@/hooks/use_params'

type ChatContextProps = {
  channels: Channel[]
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>
  conversations: Conversation[]
  messages: MessageType[]
}

export const ChatContext = React.createContext<ChatContextProps>({
  channels: [],
  setChannels: () => {},
  conversations: [],
  messages: [],
})

const ChatProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const pageProps = usePageProps<
    ChatContextProps & { currentConversation: Conversation; currentChannel: Channel }
  >()
  const params = useParams()
  const [messages, setMessages] = React.useState(pageProps.messages)
  const [conversations, setConversations] = React.useState(pageProps.conversations)
  const [channels, setChannels] = React.useState(pageProps.channels)

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
          if (message.channel && pageProps.currentChannel.slug !== message.channel.slug) {
            return
          }
          if (
            message.conversation &&
            pageProps.currentConversation?.id !== message.conversation.id
          ) {
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
        if ('channels' in parsedJSON) {
          const { channels } = parsedJSON as { channels: Channel[] }
          setChannels(channels)
          if (!pageProps.currentChannel && channels.length > 0) {
            window.location.href = `/organizations/${params.organizationSlug}/chat?channel=${channels[0].slug}`
          }
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
          if (pageProps.currentChannel.id === channelDeleted.id) {
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

  return (
    <ChatContext.Provider
      value={{
        channels,
        setChannels,
        conversations,
        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
