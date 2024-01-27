import React from 'react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { useToast } from '@/hooks/use_toast'
import slugify from '@/lib/slugify'
import { IconCircleCheck } from '@tabler/icons-react'
import { useForm } from '@inertiajs/react'
import type { Project } from '@/concerns/projects/types/project'
import type { Application } from '../types/application'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'

export type AppSettingsCardProps = {
  project: Project
  application: Application
}

export default function ApplicationSettingsCard({ project, application }: AppSettingsCardProps) {
  const { toast } = useToast()

  const form = useForm({
    name: application.name,
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.patch(`/projects/${project.id}/applications/${application.id}`, {
      onSuccess: () => {
        toast({
          title: (
            <div className="flex items-center space-x-2">
              <IconCircleCheck className="text-blue-600 h-5 w-5" />
              <p>Saved Successfully !</p>
            </div>
          ),
        })
      },
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
