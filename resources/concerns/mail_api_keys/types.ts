import type { MailDomain } from "../mail_domains/types"

export type MailApiKey = {
  id: string
  name: string
  value: string
  domain: string
  mailDomain: MailDomain
  createdAt: string
  updatedAt: string
}
