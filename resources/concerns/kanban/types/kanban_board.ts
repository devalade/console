import type { Column } from './kanban_column'

export type KanbanBoard = {
  id: number
  slug: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
  columns: Column[]
}
