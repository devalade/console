import * as React from 'react'
import type { Message as MessageType } from '../types/message'
import formatMessageDate from '../lib/format_message_date'
import { IconMessageReply, IconPencil, IconTrash } from '@tabler/icons-react'
import useUser from '@/hooks/use_user'
import DeleteMessageDialog from './delete_message_dialog'
import UpdateMessageDialog from './update_message_dialog'
import Avatar from '@/components/avatar'
import BotAvatar from './bot_avatar'
import Button from '@/components/button'

interface MessageProps {
  message: MessageType
}

const Message: React.FunctionComponent<MessageProps> = ({ message }) => {
  const user = useUser()
  const isOwner = user.id === message.user?.id
  const isAskedToAnswer = message.askedUserForAnswer?.id === user.id
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  function reply() {
    /**
     * To allow the user to reply,
     * we need to fill the input from the `#send-message-form` form,
     * with the prefix `Reply To @bot: ` and focus the input.
     */
    const form = document.getElementById('send-message-form') as HTMLFormElement
    const input = form.querySelector('input') as HTMLInputElement
    input.value = `Reply to @${message.bot}: `
    input.focus()
  }

  return (
    <li key={message.id}>
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

      <div className="px-2 flex space-x-2">
        {message.user ? <Avatar user={message.user} /> : <BotAvatar bot={message.bot} />}

        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{message.user?.fullName || message.bot}</span>
            <span className="uppercase text-xs text-zinc-800 mt-[2px]">
              {formatMessageDate(message.createdAt)}
            </span>

            {isOwner && (
              <div className="flex ml-auto mt-[2px]">
                <IconPencil
                  className="w-4 h-4 mr-2 text-zinc-600 cursor-pointer"
                  onClick={() => setShowUpdateDialog(true)}
                />

                <IconTrash
                  className="w-4 h-4 text-red-600 cursor-pointer"
                  onClick={() => setShowDeleteDialog(true)}
                />
              </div>
            )}

            {isAskedToAnswer && !message.replied && (
              <div className="flex ml-auto mt-[2px]">
                <IconMessageReply
                  className="w-4 h-4 text-zinc-600 cursor-pointer hover:opacity-80"
                  onClick={reply}
                />
              </div>
            )}
          </div>
          <span className="text-sm text-zinc-900">{message.body}</span>
        </div>
      </div>
    </li>
  )
}

export default Message
