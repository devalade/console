import Button from '@/components/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'
import { useForm } from '@inertiajs/react'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/dialog'
import React from 'react'
import useParams from '@/hooks/use_params'

export default function DeleteStorageBucketCard() {
  const form = useForm({})
  const params = useParams()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.delete(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/storage_buckets/${params.storageBucketSlug}`
    )
  }

  return (
    <div className="py-6 px-10">
      <Card variant="destructive">
        <CardHeader className="!border-red-600/30">
          <CardTitle>Delete Storage Bucket</CardTitle>
          <CardDescription>
            Once you delete your storage bucket, there is no going back. All your data will be
            deleted.
          </CardDescription>
        </CardHeader>
        <CardContent variant="destructive">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Storage Bucket</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
              <DialogHeader>
                <DialogTitle>Delete Storage Bucket</DialogTitle>

                <DialogDescription>
                  Are you sure you want to delete your storage bucket?
                </DialogDescription>
              </DialogHeader>

              <form
                className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
                onSubmit={onSubmit}
              >
                <Button variant="destructive" loading={form.processing} type="submit">
                  Delete Storage Bucket
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
