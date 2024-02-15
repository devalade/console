import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import type { KanbanColumn } from '../types/kanban_column'
import { ColumnHeader } from './kanban_colomn_header'
import Button from '@/components/button'
import { IconPlus } from '@tabler/icons-react'
import { ColumnItem } from './kanban_column_item'

export function Column(props: KanbanColumn & { index: number }) {
  const { id, name, tasks, index } = props
  return (
    <Draggable draggableId={id.toString()+ "-list"} index={index}>
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
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <Button
              className="w-full mt-4 border-2 border-dashed gap-x-2 bg-transparent"
              variant="outline"
            >
              <IconPlus className="w-4" />
              Add card
            </Button>
          </div>
        </li>
      )}
    </Draggable>
  )
}
