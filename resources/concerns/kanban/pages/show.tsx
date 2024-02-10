import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { KanbanBoard } from '../types/kanban_board'
import KanbanBoardLayout from '../kanban_board_layout'

interface ShowProps {
  project: Project
  board: KanbanBoard
}

const Show: React.FunctionComponent<ShowProps> = ({ project, board }) => {
  return <KanbanBoardLayout project={project} board={board} />
}

export default Show
