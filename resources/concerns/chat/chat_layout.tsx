import MainLayout from '@/layouts/main_layout'
import * as React from 'react'
import ChatProvider from './chat_context'

const ChatLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <ChatProvider>
      <MainLayout className="!p-0">
        <div className="flex  min-h-[calc(100vh-64px)]">{children}</div>
      </MainLayout>
    </ChatProvider>
  )
}

export default ChatLayout
