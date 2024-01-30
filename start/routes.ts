/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ForgotPasswordController from '#controllers/auth/forgot_password_controller'
import GithubController from '#controllers/auth/github_controller'
import ResetPasswordController from '#controllers/auth/reset_password_controller'
import SignInController from '#controllers/auth/sign_in_controller'
import SignUpController from '#controllers/auth/sign_up_controller'
import SettingsController from '#controllers/settings_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import SignOutController from '#controllers/auth/sign_out_controller'
import ProjectsController from '#controllers/projects_controller'
import ApplicationsController from '#controllers/applications_controller'
import DatabasesController from '#controllers/databases_controller'
import CliController from '#controllers/auth/cli_controller'
import EnvironmentVariablesController from '#controllers/environment_variables_controller'
import CertificatesController from '#controllers/certificates_controller'

router.get('/', async ({ auth, response }) => {
  if (auth.isAuthenticated) {
    return response.redirect().toPath('/dashboard')
  }
  return response.redirect().toPath('/auth/sign_in')
})

/**
 * Authentication routes.
 */
router.get('/auth/sign_up', [SignUpController, 'show'])
router.post('/auth/sign_up', [SignUpController, 'handle'])

router.get('/auth/sign_in', [SignInController, 'show'])
router.post('/auth/sign_in', [SignInController, 'handle'])

router.get('/auth/forgot_password', [ForgotPasswordController, 'show'])
router.post('/auth/forgot_password', [ForgotPasswordController, 'handle'])

router.get('/auth/reset_password/:email', [ResetPasswordController, 'show'])
router.post('/auth/reset_password/:email', [ResetPasswordController, 'handle'])

router.post('/auth/sign_out', [SignOutController, 'handle'])

/**
 * Github authentication.
 */
router.get('/auth/github/redirect', [GithubController, 'redirect'])
router.get('/auth/github/callback', [GithubController, 'callback'])

/**
 * CLI authentication.
 */
router.get('/auth/cli/session', [CliController, 'getSession'])
router.get('/auth/cli/check', [CliController, 'check'])
router.get('/auth/cli/:sessionId/wait', [CliController, 'wait'])
router
  .group(() => {
    router.get('/auth/cli/:sessionId', [CliController, 'show'])
    router.post('/auth/cli/:sessionId', [CliController, 'handle'])
  })
  .use(middleware.auth())

/**
 * User settings.
 */
router.get('/settings', [SettingsController, 'edit']).use(middleware.auth())
router.patch('/settings', [SettingsController, 'update']).use(middleware.auth())
router.delete('/settings', [SettingsController, 'destroy']).use(middleware.auth())

/**
 * Projects CRUD.
 */
router
  .resource('projects', ProjectsController)
  .params({ projects: 'projectSlug' })
  .use('*', middleware.auth())
  .use('edit', middleware.loadProjects())

/**
 * Applications CRUD.
 */
router
  .resource('projects.applications', ApplicationsController)
  .params({ projects: 'projectSlug', applications: 'applicationSlug' })
  .use('*', [middleware.auth(), middleware.loadProjects()])
  .except(['create'])

/**
 * Environment variables.
 */
router
  .get('/projects/:projectSlug/applications/:applicationSlug/env', [
    EnvironmentVariablesController,
    'edit',
  ])
  .use([middleware.auth(), middleware.loadProjects()])
router
  .patch('/projects/:projectSlug/applications/:applicationSlug/env', [
    EnvironmentVariablesController,
    'update',
  ])
  .use([middleware.auth(), middleware.loadProjects()])

/**
 * Databases.
 */
router
  .resource('projects.databases', DatabasesController)
  .params({ projects: 'projectSlug', databases: 'databaseSlug' })
  .use('*', [middleware.auth(), middleware.loadProjects()])
  .except(['create', 'edit', 'update'])

/**
 * Certificates.
 */
router
  .get('/projects/:projectSlug/applications/:applicationSlug/certificates', [
    CertificatesController,
    'index',
  ])
  .use([middleware.auth(), middleware.loadProjects()])
router
  .post('/projects/:projectSlug/applications/:applicationSlug/certificates', [
    CertificatesController,
    'store',
  ])
  .use(middleware.auth())
router
  .post('/projects/:projectSlug/applications/:applicationSlug/certificates/:domain/check', [
    CertificatesController,
    'check',
  ])
  .use(middleware.auth())
router
  .post('/projects/:projectSlug/applications/:applicationSlug/certificates/:id/check', [
    CertificatesController,
    'check',
  ])
  .use(middleware.auth())
router
  .delete('/projects/:projectSlug/applications/:applicationSlug/certificates/:id', [
    CertificatesController,
    'destroy',
  ])
  .use(middleware.auth())
