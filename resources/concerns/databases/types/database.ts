export type Database = {
  id: number
  slug: string
  uri: string
  name: string
  username: string
  password: string
  host: string
  dbms: 'postgres' | 'mysql' | 'redis'
}
