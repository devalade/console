import type { Project } from '@/concerns/projects/types/project'
import { IconLayoutKanban } from '@tabler/icons-react'
import type { Board } from '../types/board'
import { Link } from '@inertiajs/react'
import useParams from '@/hooks/use_params'
import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/card'

interface KanbanBoardCardProps {
  project: Project
  kanbanBoard: Board
}

const KanbanBoardCard: React.FunctionComponent<KanbanBoardCardProps> = ({
  project,
  kanbanBoard,
}) => {
  const params = useParams()
  return (
    <Link
      href={`/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${kanbanBoard.slug}`}
    >
      <Card className="hover:opacity-75 transition">
        <CardContent>
          <CardTitle className="!text-lg flex items-center space-x-2 font-semibold">
            <span>{kanbanBoard.name}</span>
          </CardTitle>
          <IconLayoutKanban className="w-5 h-5 mt-2 text-blue-600" />
        </CardContent>
      </Card>
    </Link>
  )
}

export default KanbanBoardCard
