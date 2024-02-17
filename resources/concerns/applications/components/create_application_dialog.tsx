import Button from '@/components/button'
import type { Project } from '@/concerns/projects/types/project'
import { useForm } from '@inertiajs/react'
import * as React from 'react'
import CreateApplicationDialogGithubStep from './create_application_dialog_github_step'
import CreateApplicationDialogNamingStep from './create_application_naming_step'
import useParams from '@/hooks/use_params'
import SteppedDialog from '@/components/stepped_dialog'
import isFeatureEnabled from '@/lib/is_feature_enabled'

interface CreateApplicationDialogProps {
  project: Project
  open: boolean
  setOpen: (open: boolean) => void
}

const CreateApplicationDialog: React.FunctionComponent<CreateApplicationDialogProps> = ({
  project,
  open,
  setOpen,
}) => {
  const params = useParams()
  const form = useForm({
    name: '',
    githubRepository: '',
    githubBranch: '',
    githubInstallationId: 0,
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/organizations/${params.organizationSlug}/projects/${project.slug}/applications`, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <SteppedDialog
      title="New Application"
      open={open}
      setOpen={setOpen}
      steps={[
        <CreateApplicationDialogNamingStep form={form} />,
        isFeatureEnabled('deployments:github') && <CreateApplicationDialogGithubStep form={form} />,
      ]}
      submitButton={
        <Button loading={form.processing} type="button">
          <span>Create new application</span>
        </Button>
      }
      onSubmit={handleSubmit}
    />
  )
}

export default CreateApplicationDialog
