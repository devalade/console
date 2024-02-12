import MainLayout from '@/layouts/main_layout'
import * as React from 'react'
import ChatLeftSidebar from '../components/chat_left_sidebar'
import ChatRightSidebar from '../components/chat_right_sidebar'
import type { Member } from '../types/member'
import type { Channel } from '../types/channel'

interface ChatProps {
  channels: Channel[]
  currentChannel: Channel
  members: Member[]
}

const Chat: React.FunctionComponent<ChatProps> = ({ currentChannel, channels, members }) => {
  return (
    <MainLayout className="!p-0">
      <div className="grid grid-cols-1 md:grid-cols-6 min-h-[calc(100vh-64px)]">
        <ChatLeftSidebar channels={channels} currentChannel={currentChannel} />
        <div className="p-4 md:col-span-4"></div>
        <ChatRightSidebar members={members} />
      </div>
    </MainLayout>
  )
}

export default Chat
