import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { KanbanBoard } from '../types/kanban_board'
import KanbanBoardLayout from '../kanban_board_layout'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Column } from '../components/kanban_colomn'
import { router } from '@inertiajs/react'
import useParams from '@/hooks/use_params'

interface ShowProps {
  project: Project
  board: KanbanBoard
}

type Result = {
  draggableId: string
  type: 'card' | 'column'
  source: {
    index: number
    droppableId: string
  }
  reason: 'DROP'
  mode: 'FLUID'
  destination: {
    droppableId: string
    index: number
  }
  combine: null
}

const Show: React.FunctionComponent<ShowProps> = ({ project, board }) => {
  const params = useParams()
  const sortedColumns = board.columns.sort().sort((a, b) => {
    if (a.order < b.order) return -1
    if (a.order > b.order) return 1
    return 0
  })

  function onDragEnd({ destination, source, type }: Result) {
    /**
     * Skip if the user drops the item in the same place.
     */
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    ) {
      return
    }

    /**
     * The user moves a column.
     */
    if (type === 'column') {
      /**
       * Retrieve the first and second columns.
       */
      const firstColumn = board.columns[source.index]
      const secondColumn = board.columns[destination.index]

      /**
       * Update the order of the columns.
       */
      router.put(
        `/organizations/${params.organizationSlug}/projects/${project.slug}/kanban_boards/${board.slug}/columns/${firstColumn.id}`,
        { order: secondColumn.order }
      )
    }

    /**
     * The user moves a card.
     */
    if (type === 'card') {
      /**
       * Retrieve the source and destination columns.
       */
      const sourceColumn = board.columns.find((column) => column.id === +source.droppableId)
      const destColumn = board.columns.find((column) => column.id === +destination.droppableId)
      if (!sourceColumn || !destColumn) return

      /**
       * The card is moved within the same column.
       * We only need to update the order of the cards.
       */
      if (source.droppableId === destination.droppableId) {
        // TODO: Implement the logic for moving cards within the same column.
      } else {
        /**
         * The card is moved to a different column.
         * We need to update the order of the cards in both columns.
         */
        // TODO: Implement the logic for moving cards to a different column.
      }
    }
  }

  return (
    <KanbanBoardLayout project={project} board={board}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" type="column" direction="horizontal">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-x-4 items-start w-full h-full overflow-x-scroll "
            >
              {sortedColumns.map((column, index) => (
                <>
                  <Column key={column.id} {...column} index={index} />
                </>
              ))}
              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>
    </KanbanBoardLayout>
  )
}

export default Show
