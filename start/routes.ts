/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ForgotPasswordController from '#controllers/auth/forgot_password_controller'
import AuthGithubController from '#controllers/auth/github_controller'
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
import LogsController from '#controllers/logs_controller'
import DeploymentsController from '#controllers/deployments_controller'
import GitHubDeploymentsController from '#controllers/github_deployments_controller'
import GitHubController from '#controllers/github_controller'
import FlyWebhooksController from '#drivers/fly/fly_logs_controller'
import KanbanBoardsController from '#controllers/kanban/kanban_boards_controller'
import KanbanColumnsController from '#controllers/kanban/kanban_columns_controller'
import KanbanTasksController from '#controllers/kanban/kanban_tasks_controller'
import Organization from '#models/organization'

router.get('/', async ({ auth, response }) => {
  if (auth.isAuthenticated) {
    const organization = await Organization.query()
      .where('id', auth.user!.defaultOrganizationId)
      .firstOrFail()
    return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
  }
  return response.redirect().toPath('/auth/sign_in')
})

router
  .get('/projects', async ({ auth, response }) => {
    const organization = await Organization.query()
      .where('id', auth.user!.defaultOrganizationId)
      .firstOrFail()
    return response.redirect().toPath(`/organizations/${organization.slug}/projects`)
  })
  .use(middleware.auth())

/**
 * Authentication routes.
 */
router.get('/auth/sign_up', [SignUpController, 'show'])
router.post('/auth/sign_up', [SignUpController, 'handle']).use(middleware.drapeau('sign_up'))

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
router.get('/auth/github/redirect', [AuthGithubController, 'redirect'])
router.get('/auth/github/callback', [AuthGithubController, 'callback'])

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
  .resource('organizations.projects', ProjectsController)
  .params({ organizations: 'organizationSlug', projects: 'projectSlug' })
  .use('*', middleware.auth({ guards: ['web', 'api'] }))
  .use('edit', middleware.loadProjects())

/**
 * Applications CRUD.
 */
router
  .resource('organizations.projects.applications', ApplicationsController)
  .params({
    organizations: 'organizationSlug',
    projects: 'projectSlug',
    applications: 'applicationSlug',
  })
  .use('*', [middleware.auth({ guards: ['web', 'api'] }), middleware.loadProjects()])
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
  .use([middleware.auth({ guards: ['web', 'api'] })])

/**
 * Databases.
 */
router
  .resource('organizations.projects.databases', DatabasesController)
  .params({ organizations: 'organizationSlug', projects: 'projectSlug', databases: 'databaseSlug' })
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
  .delete('/projects/:projectSlug/applications/:applicationSlug/certificates/:id', [
    CertificatesController,
    'destroy',
  ])
  .use(middleware.auth())

/**
 * Logs.
 */
router
  .get('/projects/:projectSlug/applications/:applicationSlug/logs', [LogsController, 'show'])
  .use([middleware.auth(), middleware.loadProjects()])
router
  .get('/projects/:projectSlug/applications/:applicationSlug/logs/stream', [
    LogsController,
    'stream',
  ])
  .use([middleware.auth({ guards: ['web', 'api'] })])

/**
 * Deployments.
 */
router
  .get('/projects/:projectSlug/applications/:applicationSlug/deployments', [
    DeploymentsController,
    'index',
  ])
  .use([middleware.auth(), middleware.loadProjects()])
router
  .post('/projects/:projectSlug/applications/:applicationSlug/deployments', [
    DeploymentsController,
    'store',
  ])
  .use([middleware.auth({ guards: ['api'] })])
router
  .get('/projects/:projectSlug/applications/:applicationSlug/deployments/updates', [
    DeploymentsController,
    'streamUpdates',
  ])
  .use([middleware.auth({ guards: ['web', 'api'] })])

/**
 * GitHub-related routes.
 */
router
  .group(() => {
    router
      .get('/repositories', [GitHubController, 'listRepositories'])
      .use(middleware.auth({ guards: ['api', 'web'] }))
    router
      .get('/repositories/stream', [GitHubController, 'streamRepositoriesListUpdate'])
      .use(middleware.auth({ guards: ['api', 'web'] }))
    router
      .get('/:applicationSlug/branches', [GitHubController, 'listBranches'])
      .use(middleware.auth({ guards: ['api', 'web'] }))

    router.post('/webhooks', [GitHubDeploymentsController, 'handleWebhooks'])
  })
  .prefix('/api/github')

/**
 * Fly webhooks (in order to retrieve logs)
 */
router.post('/fly/webhooks/logs', [FlyWebhooksController, 'handleIncomingLogs'])

/**
 * Kanban routes.
 */
router
  .resource('organizations.projects.kanban', KanbanBoardsController)
  .params({ organizations: 'organizationSlug', projects: 'projectSlug', kanban: 'kanbanBoardSlug' })
  .use('*', middleware.auth())
  .use(['index', 'show', 'edit'], middleware.loadProjects())

router
  .resource('organizations.projects.kanban.columns', KanbanColumnsController)
  .except(['index', 'show', 'edit'])
  .params({
    organizations: 'organizationSlug',
    projects: 'projectSlug',
    kanban: 'kanbanBoardSlug',
    columns: 'kanbanColumnId',
  })
  .use('*', middleware.auth())

router
  .resource('organizations.projects.kanban.columns.tasks', KanbanTasksController)
  .except(['index', 'show', 'edit'])
  .params({
    organizations: 'organizationSlug',
    projects: 'projectSlug',
    kanban: 'kanbanBoardSlug',
    columns: 'kanbanColumnId',
    tasks: 'kanbanTaskId',
  })
  .use('*', middleware.auth())
