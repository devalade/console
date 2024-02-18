import type { KanbanTask } from './kanban_task'

export type KanbanColumn = {
  id: number
  name: string
  boardId: number
  order: number
  createdAt: string
  updatedAt: string
  tasks: KanbanTask[]
}
