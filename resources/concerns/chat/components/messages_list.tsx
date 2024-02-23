import * as React from 'react'
import { useContext } from 'react'
import { ChatContext } from '../chat_context'
import Message from './message'

interface MessagesListProps {}

const MessagesList: React.FunctionComponent<MessagesListProps> = () => {
  const messagesListRef = React.useRef<HTMLUListElement>(null)
  const { messages } = useContext(ChatContext)

  React.useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ul
      className="list-none p-0 mb-4 m-0 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto"
      ref={messagesListRef}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ul>
  )
}

export default MessagesList
