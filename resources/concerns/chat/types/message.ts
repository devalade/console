import type { User } from '~/types/user'

export type Message = {
  id: number
  body: string
  createdAt: string
  bot: string | null
  user?: User
  askedUserForAnswer?: User
  channel?: { slug: string }
  conversation?: { id: number }
  replied?: boolean
}
