import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { KanbanBoard } from '../types/kanban_board'
import KanbanBoardLayout from '../kanban_board_layout'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Badge } from '@/components/badge'

interface ShowProps {
  project: Project
  board: KanbanBoard
}

const Show: React.FunctionComponent<ShowProps> = ({ project, board }) => {
  console.log({ project, board })
  return (
    <KanbanBoardLayout project={project} board={board}>
      <div className="w-full h-full overflow-x-scroll ">
        <Column />
      </div>
    </KanbanBoardLayout>
  )
}

export default Show

function Column(props) {
  return (
    <div className="w-52">
      <div className="flex items-center justify-between mb-4 py-4 border-b-2 border-gray-500">
        <div className="flex items-center gap-x-2">
          <p className="text-sm font-medium ">TODO</p>
          <Badge variant="outline"> 3</Badge>
        </div>
      </div>
    </div>
  )
}
