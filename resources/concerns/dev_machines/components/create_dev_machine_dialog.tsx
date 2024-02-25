import Button from '@/components/button'
import Input from '@/components/input'
import Label from '@/components/label'
import SteppedDialog from '@/components/stepped_dialog'
import useParams from '@/hooks/use_params'
import slugify from '@/lib/slugify'
import { cn } from '@/lib/utils'
import { useForm } from '@inertiajs/react'
import * as React from 'react'

interface CreateDevMachineDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const CreateDevMachineDialog: React.FunctionComponent<CreateDevMachineDialogProps> = ({
  open,
  setOpen,
}) => {
  const params = useParams()
  const form = useForm<{
    name: string
    password: string
    resourcesConfig: 'standard' | 'large'
  }>({
    name: '',
    password: '',
    resourcesConfig: 'standard',
  })

  const handleSubmit = () => {
    form.post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/dev_machines`,
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <SteppedDialog
      title="Create a new dev machine"
      open={open}
      setOpen={setOpen}
      steps={[
        // [1] Name+Password
        <div className="space-y-4">
          <div className="grid gap-1 px-6">
            <Label>Name</Label>
            <Input
              id="name"
              className="!col-span-3 w-full"
              placeholder="batmachine"
              value={form.data.name}
              onChange={(e) => form.setData('name', slugify(e.target.value))}
            />
          </div>

          <div className="grid gap-1 pb-4 px-6">
            <Label>Password</Label>
            <Input
              id="password"
              placeholder="••••••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
            />
          </div>
        </div>,
        // [2] ResourcesConfigurator
        <div className="py-4 px-6">
          <fieldset>
            <div className="space-y-4">
              <label
                className={cn(
                  'relative flex px-4 py-2 shadow-sm rounded-sm w-full border cursor-pointer',
                  form.data.resourcesConfig === 'standard' ? 'border-blue-600' : 'border-input'
                )}
                htmlFor="server-size"
                onClick={() => form.setData('resourcesConfig', 'standard')}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Standard</span>
                    <span className="text-xs">Ubuntu 22.04 4 cores, 8GB RAM, 10GB</span>
                  </div>
                </div>
              </label>
              <label
                className={cn(
                  'relative flex px-4 py-2 shadow-sm rounded-sm w-full border cursor-pointer',
                  form.data.resourcesConfig === 'large' ? 'border-blue-600' : 'border-input'
                )}
                htmlFor="server-size"
                onClick={() => form.setData('resourcesConfig', 'large')}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Large</span>
                    <span className="text-xs">Ubuntu 22.04 8 cores, 16GB RAM, 30GB</span>
                  </div>
                </div>
              </label>
            </div>
          </fieldset>
        </div>,
      ]}
      submitButton={
        <Button loading={form.processing} onClick={handleSubmit}>
          <span>Create new dev machine</span>
        </Button>
      }
    ></SteppedDialog>
  )
}

export default CreateDevMachineDialog
