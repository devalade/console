import type { Project } from '@/concerns/projects/types/project'
import useSuccessToast from '@/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import * as React from 'react'
import { DialogHeader, DialogTitle, Dialog, DialogContent, DialogFooter } from '@/components/dialog'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'
import useParams from '@/hooks/use_params'
import slugify from '@/lib/slugify'

interface CreateStorageBucketDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const CreateStorageBucketDialog: React.FunctionComponent<CreateStorageBucketDialogProps> = ({
  open,
  setOpen,
}) => {
  const params = useParams()
  const form = useForm({
    name: '',
  })
  const successToast = useSuccessToast()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    form.post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/storage_buckets`,
      {
        onSuccess: () => successToast(),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle className="items-center space-x-2">
            <span>Create Storage Bucket</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-1 pb-4 px-6">
            <Label>Name</Label>
            <Input
              id="name"
              className="!col-span-3 w-full"
              placeholder="Name"
              value={form.data.name}
              onChange={(e) => form.setData('name', slugify(e.target.value))}
            />
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between space-x-2">
              <Button type="submit" loading={form.processing}>
                Create storage bucket
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateStorageBucketDialog
