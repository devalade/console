import React from 'react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../../types/application'
import type { Certificate } from '../../types/certificates'
import { useForm } from '@inertiajs/react'
import {
  DialogHeader,
  DialogDescription,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/dialog'
import Button from '@/components/button'
import useParams from '@/hooks/use_params'

export type DeleteCertificateDialogProps = {
  project: Project
  application: Application
  certificate: Certificate

  open: boolean
  setOpen: (open: boolean) => void
}

export default function DeleteCertificateDialog({
  project,
  application,
  certificate,
  open,
  setOpen,
}) {
  const form = useForm()
  const params = useParams()
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.delete(
      `/organizations/${params.organizationSlug}/projects/${project.slug}/applications/${application.slug}/certificates/${certificate.id}`
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
        <DialogHeader>
          <DialogTitle>Delete certificate</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this certificate? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form
          className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
          onSubmit={onSubmit}
        >
          <Button variant="destructive" loading={form.processing}>
            Delete certificate
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
