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
import type { Database } from '../types/database'
import type { Project } from '@/concerns/projects/types/project'

export type DeleteDatabaseDialogProps = {
  project: Project
  database: Database

  open: boolean
  setOpen: (open: boolean) => void
}

export default function DeleteDatabaseDialog({ database, project, open, setOpen }) {
  const { delete: handleDelete, processing } = useForm()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleDelete(`/projects/${project.slug}/databases/${database.slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
        <DialogHeader>
          <DialogTitle>Delete database</DialogTitle>

          <DialogDescription>Are you sure you want to delete this database?</DialogDescription>
        </DialogHeader>

        <form
          className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
          onSubmit={onSubmit}
        >
          <Button variant="destructive" loading={processing}>
            Delete database
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
