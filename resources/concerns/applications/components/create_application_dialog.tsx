import Button from '@/components/button'
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import Input from '@/components/input'
import Label from '@/components/label'
import type { Project } from '@/concerns/projects/types/project'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import * as React from 'react'

interface CreateApplicationDialogProps {
  project: Project
  open: boolean
  setOpen: (open: boolean) => void
}

const CreateApplicationDialog: React.FunctionComponent<CreateApplicationDialogProps> = ({
  project,
  open,
  setOpen,
}) => {
  const form = useForm({
    name: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/projects/${project.slug}/applications`, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-1">
              <Label>Application Name</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                value={form.data.name}
                placeholder="webapp"
                onChange={(e) => form.setData('name', slugify(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Create new application</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateApplicationDialog
