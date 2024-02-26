import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from '@/components/dialog'
import Button from '@/components/button'
import { useForm } from '@inertiajs/react'
import Label from '@/components/label'
import Input from '@/components/input'
import useParams from '@/hooks/use_params'

export type AddMailDomainDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AddMailDomainDialog({ open, setOpen }: AddMailDomainDialogProps) {
  const params = useParams()
  const form = useForm({
    domain: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mail_domains`,
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>Add Mail Domain</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-1">
              <Label>Mail Domain</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                value={form.data.domain}
                placeholder="acme.com"
                onChange={(e) => form.setData('domain', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Add Mail Domain</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
