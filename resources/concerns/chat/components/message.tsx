import * as React from 'react'
import type { Message as MessageType } from '../types/message'
import formatMessageDate from '../lib/format_message_date'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import useUser from '@/hooks/use_user'
import DeleteMessageDialog from './delete_message_dialog'
import UpdateMessageDialog from './update_message_dialog'
import Avatar from '@/components/avatar'
import BotAvatar from './bot_avatar'

interface MessageProps {
  message: MessageType
}

const Message: React.FunctionComponent<MessageProps> = ({ message }) => {
  const user = useUser()
  const isOwner = user.id === message.user?.id
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  return (
    <li key={message.id} className="px-2 flex space-x-2">
      <UpdateMessageDialog
        message={message}
        open={showUpdateDialog}
        setOpen={setShowUpdateDialog}
      />
      <DeleteMessageDialog
        message={message}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
      />

      {message.user ? <Avatar user={message.user} /> : <BotAvatar bot={message.bot} />}

      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{message.user?.fullName || message.bot}</span>
          <span className="uppercase text-xs text-zinc-800">
            {formatMessageDate(message.createdAt)}
          </span>
          {isOwner && (
            <div className="flex ml-auto">
              <IconPencil
                className="w-4 h-4 mr-2 text-zinc-600 cursor-pointer"
                onClick={() => setShowUpdateDialog(true)}
              />

              <IconTrash
                className="w-4 h-4 mr-2 text-red-600 cursor-pointer"
                onClick={() => setShowDeleteDialog(true)}
              />
            </div>
          )}
        </div>
        <span className="text-sm text-zinc-900">{message.body}</span>
      </div>
    </li>
  )
}

export default Message
