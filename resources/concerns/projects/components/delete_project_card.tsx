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
import type { Project } from '../types/project'
import { useForm } from '@inertiajs/react'

export type DeleteProjectCardProps = {
  project: Project
}

export default function DeleteProjectCard({ project }: DeleteProjectCardProps) {
  const { processing, delete: handleDelete } = useForm()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleDelete(`/projects/${project.id}`)
  }

  return (
    <Card className="mt-6" variant="destructive">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Delete project</CardTitle>
        <CardDescription>Are you sure you want to delete this project?</CardDescription>
      </CardHeader>
      <CardContent variant="destructive">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete project</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>

              <DialogDescription>Are you sure you want to delete this project?</DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="destructive" loading={processing}>
                Delete project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
