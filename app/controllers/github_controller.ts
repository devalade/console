import bindProjectAndApplication from '#decorators/bind_project_and_application'
import Application from '#models/application'
import Project from '#models/project'
import OctokitService from '#services/octokit_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

@inject()
export default class GitHubController {
  constructor(private octokitService: OctokitService) {}

  public async listRepositories({ auth, response }: HttpContext) {
    const { repos, owners } = await this.octokitService.listRepositoriesFromInstallations(
      auth.user!.githubInstallationIds || []
    )

    return response.json({ repos, owners })
  }

  public async streamRepositoriesListUpdate({ auth, response }: HttpContext) {
    response.prepareServerSentEventsHeaders()

    emitter.on(`github:installation:${auth.user!.id}`, async (user) => {
      response.response.write(`data: ${JSON.stringify({ loading: true })}\n\n`)
      response.response.flushHeaders()

      const { repos, owners } = await this.octokitService.listRepositoriesFromInstallations(
        user.githubInstallationIds || []
      )
      response.response.write(`data: ${JSON.stringify({ repos, owners })}\n\n`)
      response.response.flushHeaders()

      response.response.write(`data: ${JSON.stringify({ loading: false })}\n\n`)
      response.response.flushHeaders()
    })

    response.response.on('close', () => {
      response.response.end()
    })

    return response.noContent()
  }

  @bindProjectAndApplication
  public async listBranches(
    { response }: HttpContext,
    _project: Project,
    application: Application
  ) {
    if (!application.githubInstallationId || !application.githubRepository) {
      return response.json({ branches: [] })
    }

    const branches = await this.octokitService.getRepositoryBranches(
      application.githubInstallationId!,
      application.githubRepository!
    )

    return response.json({ branches })
  }
}
