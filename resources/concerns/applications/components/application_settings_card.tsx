import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'
import useSuccessToast from '@/hooks/use_success_toast'

export type AppSettingsCardProps = {
  project: Project
  application: Application
}

export default function ApplicationSettingsCard({ project, application }: AppSettingsCardProps) {
  const successToast = useSuccessToast()

  const form = useForm({
    name: application.name,
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.patch(`/projects/${project.slug}/applications/${application.slug}`, {
      onSuccess: successToast,
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="mx-10">
        <CardHeader>
          <CardTitle>Application settings</CardTitle>
        </CardHeader>
        <CardContent className="!p-0 space-y-4">
          <div className="grid gap-1 px-6 py-4">
            <Label>Application name</Label>
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
