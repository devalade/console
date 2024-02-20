import type { User } from '~/types/user'

export type Member = User & {
  role: 'owner' | 'member'
}
