import Button from '@/components/button'
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import Input from '@/components/input'
import Label from '@/components/label'
import type { Project } from '@/concerns/projects/types/project'
import slugify from '@/lib/slugify'
import { useForm } from '@inertiajs/react'
import * as React from 'react'
import CreateApplicationDialogGithubStep from './create_application_dialog_github_step'
import CreateApplicationDialogNamingStep from './create_application_naming_step'
import useParams from '@/hooks/use_params'

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
  const [currentStep, setCurrentStep] = React.useState(1)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/organizations/${params.organizationSlug}/projects/${project.slug}/applications`, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && <CreateApplicationDialogNamingStep form={form} />}
          {currentStep === 2 && <CreateApplicationDialogGithubStep form={form} />}

          <DialogFooter className="justify-between space-x-2">
            {currentStep === 1 && (
              <Button
                className="!ml-auto"
                variant="outline"
                type="button"
                onClick={() => setCurrentStep(2)}
              >
                <span>Next</span>
              </Button>
            )}
            {currentStep === 2 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <span>Previous</span>
                </Button>
                <Button type="submit" loading={form.processing}>
                  <span>Create new application</span>
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateApplicationDialog
