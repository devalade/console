import type { Organization } from '@/concerns/organizations/types/organization'

export interface Project {
  id: string
  name: string
  organizationId: number
  slug: string
  createdAt: string
  updatedAt: string
  organization: Organization
}
