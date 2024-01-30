import * as React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import { useForm } from '@inertiajs/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import Button from '@/components/button'

interface RedeployDialogProps {
  project: Project
  application: Application
  open: boolean
  setOpen: (open: boolean) => void
}

const RedeployDialog: React.FunctionComponent<RedeployDialogProps> = ({
  project,
  application,
  open,
  setOpen,
}) => {
  const form = useForm()
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post(`/projects/${project.slug}/applications/${application.slug}/redeploy`, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>Redeploy</DialogTitle>

          <DialogDescription>
            Your changes were successfully saved. You can now redeploy your application.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <form onSubmit={handleSubmit}>
            <Button type="submit" loading={form.processing}>
              <span>Redeploy</span>
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RedeployDialog
