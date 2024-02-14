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
  channels,
  conversations,
  currentConversation,
  messages,
  members,
  isOwner,
}) => {
  return (
    <MainLayout className="!p-0">
      <div className="grid grid-cols-1 md:grid-cols-6 min-h-[calc(100vh-64px)]">
        <ChatLeftSidebar
          channels={channels}
          currentChannel={currentChannel}
          conversations={conversations}
          currentConversation={currentConversation}
          messages={messages}
          members={members}
          isOwner={isOwner}
        />

        <div className="px-4 py-6 md:col-span-4 flex flex-col-reverse">
          <SendMessageForm
            currentChannel={currentChannel}
            currentConversation={currentConversation}
          />
          <ul className="list-none p-0 pb-4 m-0 space-y-4">
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
