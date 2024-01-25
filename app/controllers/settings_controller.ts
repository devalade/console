import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  async show({ inertia }: HttpContext) {
    return inertia.render('settings/show')
  }
}
