import Button from '@/components/button'
import ProjectLayout from '@/layouts/project_layout'
import * as React from 'react'
import CreateKanbanBoardDialog from '../components/create_kanban_dialog'
import type { Project } from '@/concerns/projects/types/project'
import type { Board } from '../types/board'
import KanbanBoardCard from '../components/kanban_board_card'

interface IndexProps {
  project: Project
  boards: Board[]
}

const Index: React.FunctionComponent<IndexProps> = ({ project, boards }) => {
  const [openDialog, setOpenDialog] = React.useState(false)

  return (
    <ProjectLayout>
      <div className="flex space-x-8 items-center">
        <h1 className="font-clash font-semibold text-3xl">Task boards</h1>
        <Button onClick={() => setOpenDialog(true)}>Create board</Button>
        <CreateKanbanBoardDialog open={openDialog} setOpen={setOpenDialog} project={project} />
      </div>

      <div className="mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {boards.map((board) => (
          <KanbanBoardCard key={board.id} kanbanBoard={board} project={project} />
        ))}
      </div>
    </ProjectLayout>
  )
}

export default Index
