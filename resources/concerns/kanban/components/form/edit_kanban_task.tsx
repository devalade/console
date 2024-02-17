import React, { type FormEvent } from 'react'
import useParams from '@/hooks/use_params'
import { useForm } from '@inertiajs/react'
import { Card, CardHeader } from '@/components/card'
import Button from '@/components/button'

export function EditTask(props: {
  columnId: number
  taskId: number
  title: string
  onClose: () => void
}) {
  const { taskId, columnId, title, onClose } = props
  const params = useParams()

  const { data, setData, patch, reset } = useForm({
    title,
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    patch(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}/tasks/${taskId}`
    )
    reset()
    onClose()
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader className="p-0 border-none space-y-1">
            <textarea
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              name="title"
              className="appearance-none text-sm  border-none focus:outline-none focus:border-none focus:shadow-transparent focus:ring-0 rounded "
              placeholder="Enter a title for this card..."
            ></textarea>
          </CardHeader>
        </Card>
        <div className="flex items-center mt-2">
          <Button>Save</Button>
        </div>
      </form>
    </>
  )
}
