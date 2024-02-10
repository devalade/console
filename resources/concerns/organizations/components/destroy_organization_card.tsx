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
import useParams from '@/hooks/use_params'

export type DestroyOrganizationCardProps = {
  organization: { name: string; slug: string }
}

export default function DestroyOrganizationCard({ organization }: DestroyOrganizationCardProps) {
  const { processing, delete: handleDelete } = useForm()
  const params = useParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleDelete(`/organizations/${params.organizationSlug}`)
  }

  return (
    <Card className="mt-6" variant="destructive">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Delete organization</CardTitle>
        <CardDescription>Are you sure you want to delete this organization?</CardDescription>
      </CardHeader>
      <CardContent variant="destructive">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete organization</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Delete organization</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this organization?
              </DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="destructive" loading={processing}>
                Delete organization
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
