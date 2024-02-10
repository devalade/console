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

interface DestroyKanbanBoardCardProps {}

const DestroyKanbanBoardCard: React.FunctionComponent<DestroyKanbanBoardCardProps> = () => {
  const form = useForm()
  const params = useParams()
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.delete(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}`
    )
  }
  return (
    <Card className="mt-6" variant="destructive">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Delete kanban board</CardTitle>
        <CardDescription>Are you sure you want to delete this kanban board?</CardDescription>
      </CardHeader>
      <CardContent variant="destructive">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete kanban board</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Delete kanban board</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this kanban board?
              </DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="destructive" loading={form.processing}>
                Delete kanban board
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default DestroyKanbanBoardCard
