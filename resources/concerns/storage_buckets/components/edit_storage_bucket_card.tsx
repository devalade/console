import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import type { Project } from '@/concerns/projects/types/project'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'
import useSuccessToast from '@/hooks/use_success_toast'
import useParams from '@/hooks/use_params'
import type { StorageBucket } from '../types/storage_bucket'

export type EditStorageBucketCardProps = {
  project: Project
  storageBucket: StorageBucket
}

export default function EditStorageBucketCard({
  project,
  storageBucket,
}: EditStorageBucketCardProps) {
  const successToast = useSuccessToast()
  const params = useParams()

  const form = useForm({
    name: storageBucket.name,
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.patch(
      `/organizations/${params.organizationSlug}/projects/${project.slug}/storage_buckets/${storageBucket.slug}`,
      {
        onSuccess: () => successToast(),
      }
    )
  }

  return (
    <form onSubmit={onSubmit} className="px-10 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Storage bucket settings</CardTitle>
        </CardHeader>
        <CardContent className="!p-0 space-y-4">
          <div className="grid gap-1 px-6 py-4">
            <Label>Storage bucket name</Label>
            <Input
              id="name"
              placeholder="webapp"
              value={form.data.name}
              onChange={(e) => form.setData('name', slugify(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" loading={form.processing}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
