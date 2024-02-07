import type { Certificate } from './certificates'

export type Application = {
  id: number
  name: string
  slug: string
  environmentVariables: Record<string, string>
  certificates?: Array<Certificate>
  githubBranch?: string
  githubRepository?: string
}
