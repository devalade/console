import Input from '@/components/input'
import Label from '@/components/label'
import slugify from '@/lib/slugify'
import type { useForm } from '@inertiajs/react'
import * as React from 'react'

interface CreateApplicationDialogNamingStepProps {
  form: ReturnType<
    typeof useForm<{
      name: string
    }>
  >
}

const CreateApplicationDialogNamingStep: React.FunctionComponent<
  CreateApplicationDialogNamingStepProps
> = ({ form }) => {
  return (
    <div className="grid gap-4 py-4 px-6 pt-0">
      <div className="grid gap-1">
        <Label>Application Name</Label>

        <Input
          id="name"
          className="!col-span-3 w-full"
          value={form.data.name}
          placeholder="webapp"
          onChange={(e) => form.setData('name', slugify(e.target.value))}
        />
      </div>
    </div>
  )
}

export default CreateApplicationDialogNamingStep
