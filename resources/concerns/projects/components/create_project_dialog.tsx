import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/dialog'
import Button from '@/components/button'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import Label from '@/components/label'
import Input from '@/components/input'

export type CreateProjectDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateProjectDialog({ open, setOpen }: CreateProjectDialogProps) {
  const form = useForm({
    name: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post('/projects', {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-1">
              <Label>Project Name</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                value={form.data.name}
                placeholder="acme"
                onChange={(e) => form.setData('name', slugify(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Create new project</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
