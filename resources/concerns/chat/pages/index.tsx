import * as React from 'react'
import ChatLeftSidebar from '../components/chat_left_sidebar'
import ChatRightSidebar from '../components/chat_right_sidebar'
import type { Member } from '../types/member'
import type { Channel } from '../types/channel'
import Message from '../components/message'
import SendMessageForm from '../components/send_message_form'
import type { Conversation } from '../types/conversation'
import ChatLayout from '../chat_layout'
import MessagesList from '../components/messages_list'

interface IndexProps {
  currentChannel: Channel
  currentConversation: Conversation | null
  members: Member[]
  isOwner: boolean
}

const Index: React.FunctionComponent<IndexProps> = ({
  currentChannel,
  currentConversation,
  members,
  isOwner,
}) => {
  return (
    <ChatLayout>
      <ChatLeftSidebar
        currentChannel={currentChannel}
        currentConversation={currentConversation}
        members={members}
        isOwner={isOwner}
      />

      <div className="px-4 py-6 md:col-span-4 flex flex-col-reverse w-full max-h-[calc(100vh-64px)]">
        <SendMessageForm
          currentChannel={currentChannel}
          currentConversation={currentConversation}
        />
        <MessagesList />
      </div>

      <ChatRightSidebar members={members} />
    </ChatLayout>
  )
}

export default Index
