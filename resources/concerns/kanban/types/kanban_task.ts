export type KanbanTask = {
  id: number
  title: string
  description: string
  columnId: number
  order: number
  createdAt: string | null
  updatedAt: string | null
}
