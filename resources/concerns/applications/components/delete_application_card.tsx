import React from 'react'
import Button from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/dialog'
import { useForm } from '@inertiajs/react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'

interface DeleteApplicationCardProps {
  project: Project
  application: Application
}

const DeleteApplicationCard: React.FunctionComponent<DeleteApplicationCardProps> = ({
  project,
  application,
}) => {
  const form = useForm()
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.delete(`/projects/${project.slug}/applications/${application.slug}`)
  }

  return (
    <Card className="mt-6 mx-10" variant="destructive">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Delete application</CardTitle>
        <CardDescription>
          Are you sure you want to delete this application? This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent variant="destructive">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete application</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Delete application</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this application? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="destructive" loading={form.processing} type="submit">
                Delete application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default DeleteApplicationCard
