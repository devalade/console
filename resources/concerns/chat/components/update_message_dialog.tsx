import * as React from 'react'
import useSuccessToast from '@/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import { DialogHeader, DialogTitle, Dialog, DialogContent, DialogFooter } from '@/components/dialog'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'
import useParams from '@/hooks/use_params'
import slugify from '@/lib/slugify'
import type { Message } from '../types/message'

type UpdateMessageDialogProps = {
  message: Message
  open: boolean
  setOpen: (open: boolean) => void
}

const UpdateMessageDialog: React.FC<UpdateMessageDialogProps> = ({ message, open, setOpen }) => {
  const params = useParams()
  const form = useForm({ body: message.body })
  const successToast = useSuccessToast()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    form.patch(`/organizations/${params.organizationSlug}/messages/${message.id}`, {
      onSuccess: () => {
        successToast()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle className="items-center space-x-2">
            <span>Update Message</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-1 pb-4 px-6">
            <Label>Message</Label>
            <Input
              id="name"
              className="!col-span-3 w-full"
              placeholder="Edit message..."
              value={form.data.body}
              onChange={(e) => form.setData('body', e.target.value)}
            />
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between space-x-2">
              <Button type="submit" loading={form.processing}>
                Update Message
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateMessageDialog
