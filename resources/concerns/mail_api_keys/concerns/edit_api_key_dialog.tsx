import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from '@/components/dialog'
import Button from '@/components/button'
import { useForm } from '@inertiajs/react'
import Label from '@/components/label'
import Input from '@/components/input'
import useParams from '@/hooks/use_params'
import usePageProps from '@/hooks/use_page_props'
import type { MailDomain } from '@/concerns/mail_domains/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import type { MailApiKey } from '../types'

export type EditApiKeyDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  apiKey: MailApiKey
}

export default function EditApiKeyDialog({ open, setOpen,apiKey }: EditApiKeyDialogProps) {
  const params = useParams()
  const form = useForm({
    name: apiKey.name,
    domain: apiKey.domain,
  })
  const pageProps = usePageProps<{ mailDomains: MailDomain[] }>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.patch(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/mail_api_keys/${apiKey.id}`,
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
          <DialogTitle>Edit API key</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-1">
              <Label>Name</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                value={form.data.name}
                placeholder="Your API key name"
                onChange={(e) => form.setData('name', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>Domain</Label>

              <Select defaultValue={''} onValueChange={(domain) => form.setData('domain', domain)}>
                <SelectTrigger>
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  {pageProps.mailDomains.map((mailDomain) => (
                    <SelectItem
                      value={mailDomain.domain}
                      key={mailDomain.id}
                      className="cursor-pointer"
                    >
                      <span>{mailDomain.domain}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Edit API key</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
