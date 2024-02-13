export type Organization = {
  name: string
  slug: string
  members: Array<{
    id: number
    role: 'owner' | 'member'
    user: {
      fullName: string
      email: string
    }
  }>
}
