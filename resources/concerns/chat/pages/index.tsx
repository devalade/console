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
import useChatUpdates from '../hooks/use_chat_updates'
import ChatProvider from '../chat_context'

interface ChatProps {
  currentChannel: Channel
  currentConversation: Conversation | null
  members: Member[]
  isOwner: boolean
}

const Chat: React.FunctionComponent<ChatProps> = ({
  currentChannel,
  currentConversation,
  members,
  isOwner,
}) => {
  const messagesListRef = React.useRef<HTMLUListElement>(null)
  const { channels, conversations, messages } = useChatUpdates()

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
      <ChatProvider>
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
            <SendMessageForm
              currentChannel={currentChannel}
              currentConversation={currentConversation}
            />

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
      </ChatProvider>
    </MainLayout>
  )
}

export default Chat
