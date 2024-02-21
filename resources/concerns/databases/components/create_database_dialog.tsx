import Button from '@/components/button'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/dialog'
import Input from '@/components/input'
import Label from '@/components/label'
import React from 'react'
import slugify from '@/lib/slugify'
import type { Project } from '@/concerns/projects/types/project'
import { useForm } from '@inertiajs/react'
import PasswordField from '@/components/password_field'
import useParams from '@/hooks/use_params'
import SteppedDialog from '@/components/stepped_dialog'
import isFeatureEnabled from '@/lib/is_feature_enabled'
import VolumeConfigurator from '@/components/volume_configurator'

export type CreateDatabaseDialogProps = {
  project: Project
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateDatabaseDialog({
  project,
  open,
  setOpen,
}: CreateDatabaseDialogProps) {
  const form = useForm({
    dbms: 'postgres',
    name: '',
    username: '',
    password: '',
    diskSize: isFeatureEnabled('volumes_configurator') ? 1 : undefined,
  })
  const [step, setStep] = React.useState(1)
  const params = useParams()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/organizations/${params.organizationSlug}/projects/${project.slug}/databases`, {
      onSuccess: () => {
        form.reset()
        setStep(1)
        setOpen(false)
      },
    })
  }
  const dbms = [
    { name: 'PostgreSQL', value: 'postgres' },
    { name: 'MySQL', value: 'mysql' },
    { name: 'Redis', value: 'redis' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <SteppedDialog
        title="Create database"
        open={open}
        setOpen={setOpen}
        steps={[
          <div className="grid sm:grid-cols-2 gap-4 grid-flow-row auto-rows-fr px-6 py-2">
            {dbms.map((db) => (
              <label
                key={db.value}
                htmlFor={db.value}
                className="flex cursor-pointer flex-col space-y-2 items-center justify-center space-x-2 rounded p-4 border border-accent"
              >
                <img src={`/icons/${db.value}.svg`} className="w-8 h-8" alt="PostgreSQL icon" />
                <span className="text-sm">{db.name}</span>
                <input
                  className="h-3 w-3"
                  type="radio"
                  id={db.value}
                  name="database"
                  value={db.value}
                  checked={form.data.dbms === db.value}
                  onChange={() => form.setData('dbms', db.value)}
                />
              </label>
            ))}
          </div>,

          isFeatureEnabled('volumes_configurator') && (
            <div className="px-6 py-2">
              <VolumeConfigurator
                diskSize={form.data.diskSize}
                setDiskSize={(diskSize) => form.setData('diskSize', diskSize)}
              />
            </div>
          ),

          <div className="space-y-4 px-6 py-2 pb-4">
            <div className="grid gap-1">
              <Label>Database Name</Label>
              <Input
                id="name"
                placeholder="Database Name"
                value={form.data.name}
                onChange={(e) => form.setData('name', slugify(e.target.value))}
                required
              />
            </div>
            {form.data.dbms !== 'redis' && (
              <div className="grid gap-1">
                <Label>Database Username</Label>
                <Input
                  id="username"
                  placeholder="Database Username"
                  value={form.data.username}
                  onChange={(e) => form.setData('username', e.target.value)}
                  required
                />
              </div>
            )}
            <PasswordField
              label="Database Password"
              divClassName="grid gap-1"
              id="password"
              placeholder="Database Password"
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
              required
              autogenerate
            />
          </div>,
        ]}
        submitButton={
          <Button type="submit" loading={form.processing}>
            <span>Create database</span>
          </Button>
        }
      ></SteppedDialog>
    </form>
  )
}
