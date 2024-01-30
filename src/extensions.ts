import { Request } from '@adonisjs/core/http'

Request.macro('wantsJSON', function (this: Request) {
  const firstType = this.types()[0]
  if (!firstType) {
    return false
  }

  return firstType.includes('/json') || firstType.includes('+json')
})

declare module '@adonisjs/core/http' {
  interface Request {
    wantsJSON(): boolean
  }
}
