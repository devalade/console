import * as React from 'react'
import Button from '@/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/dialog'
import { useForm } from '@inertiajs/react'
import useParams from '@/hooks/use_params'

const DestroyAnalyticsWebsiteCard: React.FunctionComponent = () => {
  const form = useForm()
  const params = useParams()
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.delete(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/analytics_websites/${params.analyticsWebsiteId}`
    )
  }
  return (
    <Card className="mt-6" variant="destructive">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Remove website</CardTitle>
        <CardDescription>Remove all analytics data for this given website.</CardDescription>
      </CardHeader>
      <CardContent variant="destructive">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Remove website</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Remove website</DialogTitle>

              <DialogDescription>
                Are you sure you want to remove this website? All data will be lost. This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="destructive" loading={form.processing}>
                Delete website
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default DestroyAnalyticsWebsiteCard
