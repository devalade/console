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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Create database</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <main className="px-6">
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4 grid-flow-row auto-rows-fr">
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
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
              </div>
            )}
          </main>

          <DialogFooter className="mt-4">
            <div className="flex w-full justify-between space-x-2">
              {step === 1 ? (
                <span></span>
              ) : (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  <span>Previous</span>
                </Button>
              )}

              {step === 1 && (
                <Button onClick={() => setStep(step + 1)} type="button">
                  <span>Next</span>
                </Button>
              )}

              {step === 2 && (
                <Button type="submit" loading={form.processing}>
                  <span>Create database</span>
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
