import * as React from 'react'
import { ChatContext } from '../chat_context'

const useChatUpdates = () => {
  return React.useContext(ChatContext)
}

export default useChatUpdates
