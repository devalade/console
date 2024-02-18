import Button from '@/components/button'
import Input from '@/components/input'
import type { Project } from '@/concerns/projects/types/project'
import useSuccessToast from '@/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import React from 'react'
import type { Application } from '../../types/application'
import useParams from '@/hooks/use_params'

export type AddCertificateFormProps = {
  project: Project
  application: Application
}

export default function AddCertificateForm({ project, application }: AddCertificateFormProps) {
  const successToast = useSuccessToast()
  const { post, processing, data, setData } = useForm({
    domain: '',
  })
  const params = useParams()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    post(
      `/organizations/${params.organizationSlug}/projects/${project.slug}/applications/${application.slug}/certificates`,
      {
        preserveState: false,
        onSuccess: () => successToast(),
      }
    )
  }

  return (
    <form className="flex items-start" onSubmit={onSubmit}>
      <span className="flex h-10 rounded-l-md border-r-0 border border-input bg-background font-medium px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-r-none">
        https://
      </span>

      <div className="w-full">
        <Input
          className="rounded-l-none rounded-r-none"
          name="domain"
          id="domain"
          placeholder="acme.com"
          value={data.domain}
          onChange={(e) => setData('domain', e.target.value)}
        />
      </div>

      <Button className="rounded-l-none" type="submit" loading={processing}>
        Add
      </Button>
    </form>
  )
}
