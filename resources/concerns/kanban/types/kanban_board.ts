import type { Column } from './column'

export type KanbanBoard = {
  id: number
  slug: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
  columns: Column[]
}
