import React, { type FormEvent, type FormEventHandler } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import type { KanbanColumn } from '../types/kanban_column'
import { ColumnHeader } from './kanban_colomn_header'
import Button from '@/components/button'
import {
  IconCalendar,
  IconMessageCircle2,
  IconPaperclip,
  IconPlus,
  IconX,
} from '@tabler/icons-react'
import { ColumnItem } from './kanban_column_item'
import { useToggle } from '@/hooks/use_toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { useForm } from '@inertiajs/react'
import useParams from '@/hooks/use_params'

export function Column(props: KanbanColumn & { index: number }) {
  const { id, name, tasks, index } = props

  return (
    <Draggable draggableId={id.toString() + '-list'} index={index}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="w-full max-w-80">
          <div {...provided.dragHandleProps} className="">
            <ColumnHeader columnName={name} countTask={tasks.length} />
            <Droppable droppableId={id.toString()} type="card">
              {(provided, snapshot) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full p-2 rounded-lg bg-secondary space-y-2"
                >
                  {tasks.map((task, idx) => (
                    <ColumnItem key={task.id} {...task} index={idx} />
                  ))}
                  <CreateNewTask columnId={id} />
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
          </div>
        </li>
      )}
    </Draggable>
  )
}

function CreateNewTask(props: { columnId: string }) {
  const { columnId } = props
  const [enabled, toggle] = useToggle(false)
  const params = useParams()
  console.log({ params })

  const { data, setData, post, reset } = useForm({
    title: '',
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    post(
      `/organizations/${params.organizationSlug}/projects/${params.projectSlug}/kanban_boards/${params.kanbanBoardSlug}/columns/${columnId}/tasks`
    )
    reset()
    toggle()
  }
  return (
    <>
      {enabled ? (
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
            <Button>Add card</Button>
            <Button variant="ghost">
              {' '}
              <IconX className="size-5" />{' '}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={toggle}
          className="w-full mt-4 border-2 border-dashed gap-x-2 bg-transparent"
          variant="outline"
        >
          <IconPlus className="w-4" />
          Add card
        </Button>
      )}
    </>
  )
}
