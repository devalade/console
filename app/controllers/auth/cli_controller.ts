import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class CliController {
  public async getSession({ response }: HttpContext) {
    const sessionId = cuid()

    await redis.set(sessionId, 'pending')

    return response.ok({ sessionId })
  }

  public async show({ params, inertia }: HttpContext) {
    const sessionId = await redis.get(params.sessionId)

    if (sessionId === 'pending') {
      return inertia.render('auth/cli')
    }

    return inertia.render('auth/cli', { success: true })
  }

  public async handle({ auth, response, params }: HttpContext) {
    try {
      const token = await User.authTokens.create(auth.user!)

      const sessionId = await redis.get(params.sessionId)
      if (sessionId !== 'pending') {
        throw new Error()
      }

      await redis.set(params.sessionId, token.value!.release())

      return response.redirect().back()
    } catch (error) {
      console.log(error)
      return response.badRequest('Bad request')
    }
  }

  public async wait({ params, response }: HttpContext) {
    const token = await redis.get(params.sessionId)

    if (token === 'pending') {
      return response.ok({ status: 'pending' })
    }

    await redis.del(params.sessionId)

    return response.ok({ status: 'done', token })
  }

  public async check({ auth, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()

      return response.json({ authenticated: true })
    } catch {
      return response.json({ authenticated: false })
    }
  }
}
