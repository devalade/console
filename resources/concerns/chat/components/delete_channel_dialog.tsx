import React from 'react'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/dialog'
import Button from '@/components/button'
import { useForm } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import type { Channel } from '../types/channel'

export type DeleteChannelDialogProps = {
  channel: Channel

  open: boolean
  setOpen: (open: boolean) => void
}

export default function DeleteChannelDialog({ channel, open, setOpen }: DeleteChannelDialogProps) {
  const { delete: handleDelete, processing } = useForm()
  const params = useParams()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleDelete(`/organizations/${params.organizationSlug}/channels/${channel.slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
        <DialogHeader>
          <DialogTitle>Delete channel</DialogTitle>

          <DialogDescription>Are you sure you want to delete this channel?</DialogDescription>
        </DialogHeader>

        <form
          className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
          onSubmit={onSubmit}
        >
          <Button variant="destructive" loading={processing}>
            Delete channel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
