import type { Organization } from '@/concerns/organizations/type'

export type KanbanBoard = {
  id: number
  slug: string
  name: string
}

export interface Project {
  id: string
  name: string
  organizationId: number
  slug: string
  createdAt: string
  updatedAt: string
  organization: Organization
}

export type Board = {
  id: number
  slug: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string
  columns: Column[]
}

export type Column = {
  id: number
  name: string
  boardId: number
  order: number
  createdAt: string
  updatedAt: string
  tasks: any[]
}
