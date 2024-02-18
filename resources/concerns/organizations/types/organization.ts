export type Organization = {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  members: Array<{
    id: number
    role: 'owner' | 'member'
    user: {
      fullName: string
      email: string
    }
  }>
}
