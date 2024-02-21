export type Message = {
  id: number
  body: string
  createdAt: string
  user?: {
    id: number
    fullName: string
    email: string
  }
  bot: string | null
  channel?: { slug: string }
  conversation?: { id: number }
}
