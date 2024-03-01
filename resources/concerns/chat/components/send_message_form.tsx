import * as React from 'react'
import Input from '@/components/input'
import Button from '@/components/button'
import { IconSend2 } from '@tabler/icons-react'
import useParams from '@/hooks/use_params'
import { useForm } from '@inertiajs/react'
import useSuccessToast from '@/hooks/use_success_toast'
import type { Channel } from '../types/channel'
import type { Conversation } from '../types/conversation'

interface SendMessageFormProps {
  currentChannel: Channel | null
  currentConversation: Conversation | null
}

const SendMessageForm: React.FunctionComponent<SendMessageFormProps> = ({
  currentChannel,
  currentConversation,
}) => {
  const form = useForm({ body: '' })
  const successToast = useSuccessToast()
  const params = useParams()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const suffix = currentConversation
      ? `conversationId=${currentConversation.id}`
      : `channelSlug=${currentChannel.slug}`
    form.post(`/organizations/${params.organizationSlug}/messages?${suffix}`, {
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        successToast('Message sent!')
      },
    })
  }

  if (!currentChannel && !currentConversation) {
    return null
  }

  return (
    <form
      className="flex items-center space-y-0 space-x-2"
      onSubmit={handleSubmit}
      id="send-message-form"
    >
      <Input
        placeholder="Type a message..."
        id="message"
        value={form.data.body}
        onChange={(e) => form.setData('body', e.target.value)}
      />
      <Button className="mt-4">
        <span>Send</span>
        <IconSend2 className="ml-2 w-4 h-4" />
      </Button>
    </form>
  )
}

export default SendMessageForm
