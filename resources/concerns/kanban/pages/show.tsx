import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Board } from '../types/board'
import KanbanBoardLayout from '../kanban_board_layout'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Badge } from '@/components/badge'
import {
  IconCalendar,
  IconDots,
  IconMessageCircle2,
  IconPaperclip,
  IconPlus,
} from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import type { Column } from '../types/column'
import Button from '@/components/button'

interface ShowProps {
  project: Project
  board: Board
}

const Show: React.FunctionComponent<ShowProps> = ({ project, board }) => {
  console.log({ project, board })

  function onDragEnd(data) {
    console.log(data)
  }

  return (
    <KanbanBoardLayout project={project} board={board}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-x-4 items-start w-full h-full overflow-x-scroll ">
          {board.columns.map((column) => (
            <Column {...column} />
          ))}
        </div>
      </DragDropContext>
    </KanbanBoardLayout>
  )
}

export default Show

function Column(props: Column) {
  const { id, name, tasks } = props
  return (
    <Droppable droppableId={id.toString()}>
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="w-80">
          <div className="flex items-center justify-between mb-4 py-4 border-b-2 border-gray-500">
            <div className="flex items-center gap-x-2">
              <p className="text-sm font-medium ">{name}</p>
              <Badge variant="outline">{tasks.length}</Badge>
            </div>
            <IconDots className="size-4 stroke-gray-500" />
          </div>

          <div className="w-full p-2 rounded-lg bg-secondary space-y-2">
            {[1, 2].map((task) => (
              <Draggable key={task.toString() + id} draggableId={task.toString() + id} index={task}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ColumnItem />{' '}
                  </div>
                )}
              </Draggable>
            ))}

            <Button
              className="w-full mt-4 border-2 border-dashed gap-x-2 bg-transparent"
              variant="outline"
            >
              <IconPlus className="w-4" />
              Add card
            </Button>
          </div>
        </div>
      )}
    </Droppable>
  )
}

function ColumnItem(props) {
  return (
    <Card>
      <CardHeader className="p-4 border-none space-y-1">
        <CardTitle className="text-sm">Task</CardTitle>
        <CardDescription className="text-xs">The description goes here.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 border-none text-xs text-secondary-foreground font-medium">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span>Progress</span>
            <span>4/10</span>
          </div>
          <div className="h-0.5 w-full bg-secondary ">
            <div className="bg-orange-500 w-1/2 h-full transition-all duration-300"></div>
          </div>
          <div className="flex"></div>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <span className="flex items-center gap-x-2 text-muted-foreground text-xs">
            <IconMessageCircle2 className="stroke-muted-foreground size-3" />
            <span>12</span>
          </span>
          <span className="flex items-center gap-x-2 text-muted-foreground text-xs">
            <IconPaperclip className="stroke-muted-foreground size-3" />
            <span>12</span>
          </span>
          <span className="flex items-center gap-x-1 text-muted-foreground text-xs">
            <IconCalendar className="stroke-muted-foreground size-3" />
            <span>Nov</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
