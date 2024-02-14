import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { Board } from '../types/board'
import KanbanBoardLayout from '../kanban_board_layout'
import EditKanbanBoardCard from '../components/edit_kanban_board_card'
import DestroyKanbanBoardCard from '../components/destroy_kanban_board_card'

interface EditProps {
  project: Project
  board: Board
}

const Edit: React.FunctionComponent<EditProps> = ({ project, board }) => {
  return (
    <KanbanBoardLayout project={project} board={board}>
      <h1 className="font-clash font-semibold text-3xl">Task board settings</h1>
      <EditKanbanBoardCard board={board} />
      <DestroyKanbanBoardCard />
    </KanbanBoardLayout>
  )
}

export default Edit
