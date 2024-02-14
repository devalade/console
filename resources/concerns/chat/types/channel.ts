import type { Message } from './message'

export type Channel = {
  id: number
  name: string
  slug: string
  order: number
  messages: Array<Message>
}
