import User from '#models/user'
import { signInValidator } from '#validators/auth/sign_in_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class SignInController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/sign_in')
  }

  async handle({ auth, request, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(signInValidator)
    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect().toPath('/settings')
    } catch {
      session.flash('errors.auth', 'Invalid credentials')
      return response.redirect().back()
    }
  }
}
