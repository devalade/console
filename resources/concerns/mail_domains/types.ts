import type { DnsEntries } from '#types/dns'

export type MailDomain = {
  id: string
  expectedDnsRecords: DnsEntries
  domain: string
  isVerified: boolean
}
