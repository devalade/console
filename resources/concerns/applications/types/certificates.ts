export type Certificate = {
  id: number
  domain: string
  dnsEntries: Array<{ type: string; name: string; value: string }>
  status: 'unconfigured' | 'pending' | 'configured'
}
