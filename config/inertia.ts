import env from '#start/env'
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'root',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    errors: (ctx) => ctx.session.flashMessages.get('errors'),
    qs: (ctx) => ctx.request.qs(),
    params: (ctx) => ctx.request.params(),
    user: (ctx) => ctx.auth.user,
    wildcardDomain: () =>
      env.get('DRIVER') === 'docker'
        ? env.get('TRAEFIK_WILDCARD_DOMAIN', 'softwarecitadel.app')
        : 'fly.dev',
    organizations: async (ctx) => {
      if (!ctx.auth.user) {
        return []
      }
      await ctx.auth.user.load('organizations')
      return ctx.auth.user.organizations
    },
  },
})
