import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { useForm } from '@inertiajs/react'
import { useToast } from '@/hooks/use_toast'
import slugify from '@/lib/slugify'
import { IconCircleCheck } from '@tabler/icons-react'
import type { Project } from '../types/project'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'

export type EditProjectCardProps = {
  project: Project
}

export default function EditProjectCard({ project }: EditProjectCardProps) {
  const { toast } = useToast()
  const form = useForm({
    name: project.name,
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.patch(`/projects/${project.slug}`, {
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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Edit project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-1">
              <Label>Project name</Label>
              <Input
                id="name"
                placeholder="acme"
                value={form.data.name}
                onChange={(e) => form.setData('name', slugify(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button loading={form.processing} type="submit">
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
