import type { Project } from '@/concerns/projects/types/project'
import * as React from 'react'
import type { KanbanBoard } from '../types/kanban_board'
import KanbanBoardLayout from '../kanban_board_layout'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import type { KanbanTask } from '../types/kanban_task'
import { Column } from '../components/kanban_colomn'

interface ShowProps {
  project: Project
  board: KanbanBoard
}

type Result = {
  draggableId: string
  type: 'card' | 'list'
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

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const Show: React.FunctionComponent<ShowProps> = ({ project, board }) => {
  const [orderedData, setOrderedData] = React.useState(board.columns)

  React.useEffect(() => {
    setOrderedData(board.columns)
  }, [board])

  function onDragEnd(result: Result) {
    const { destination, source, type } = result

    if (!destination) {
      return
    }

    // if dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // User moves a list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map((item, index) => ({
        ...item,
        order: index,
      }))

      console.log({ items })

      setOrderedData(items)
      // executeUpdateListOrder({ items, boardId })
    }

    // User moves a card
    if (type === 'card') {
      let newOrderedData = [...orderedData]

      // Source and destination list
      const sourceColumn = newOrderedData.find((column) => column.id === +source.droppableId)
      const destColumn = newOrderedData.find((column) => column.id === +destination.droppableId)

      if (!sourceColumn || !destColumn) {
        return
      }

      // Check if cards exists on the sourceColumn
      if (!sourceColumn.tasks) {
        sourceColumn.tasks = []
      }

      // Check if cards exists on the destColumn
      if (!destColumn.tasks) {
        destColumn.tasks = []
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder<KanbanTask>(
          sourceColumn.tasks,
          source.index,
          destination.index
        )

        reorderedCards.forEach((card, idx) => {
          card.order = idx
        })

        sourceColumn.tasks = reorderedCards

        setOrderedData(newOrderedData)
        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: reorderedCards,
        // })
        // User moves the card to another list
      } else {
        // Remove card from the source list
        const [movedCard] = sourceColumn.tasks.splice(source.index, 1)

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId

        // Add card to the destination list
        destColumn.tasks.splice(destination.index, 0, movedCard)

        sourceColumn.tasks.forEach((card, idx) => {
          card.order = idx
        })

        // Update the order for each card in the destination list
        destColumn.tasks.forEach((card, idx) => {
          card.order = idx
        })

        setOrderedData(newOrderedData)
        // executeUpdateCardOrder({
        //   boardId: boardId,
        //   items: destColumn.tasks,
        // })
      }
    }
  }

  return (
    <KanbanBoardLayout project={project} board={board}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="list" direction="horizontal">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-x-4 items-start w-full h-full overflow-x-scroll "
            >
              {board.columns.map((column, index) => (
                <Column key={column.id} {...column} index={index} />
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
