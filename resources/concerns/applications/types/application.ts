import type { Certificate } from './certificates'

export type Application = {
  cpu?: string
  ram?: string
  id: number
  hostname: string
  name: string
  slug: string
  environmentVariables: Record<string, string>
  certificates?: Array<Certificate>
  githubBranch?: string
  githubRepository?: string
  sharedIpv4?: string
  ipv6?: string
}
