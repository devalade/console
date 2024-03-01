import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { useForm } from '@inertiajs/react'
import Label from '@/components/label'
import Input from '@/components/input'
import Button from '@/components/button'
import useSuccessToast from '@/hooks/use_success_toast'
import useParams from '@/hooks/use_params'

export type EditOrganizationCardProps = {
  organization: { name: string; slug: string }
}

export default function EditOrganizationCard({ organization }: EditOrganizationCardProps) {
  const successToast = useSuccessToast()
  const form = useForm({
    name: organization.name,
  })
  const params = useParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.patch(`/organizations/${params.organizationSlug}`, {
      onSuccess: () => successToast(),
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Edit organization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-1">
              <Label>Organization name</Label>
              <Input
                id="name"
                placeholder="acme"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
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
