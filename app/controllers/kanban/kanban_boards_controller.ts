import bindProject from '#decorators/bind_project'
import bindProjectAndKanbanBoard from '#decorators/bind_project_and_kanban_board'
import KanbanBoard from '#models/kanban_board'
import Project from '#models/project'
import { HttpContext } from '@adonisjs/core/http'

export default class KanbanBoardsController {
  @bindProject
  public async index({ inertia }: HttpContext, project: Project) {
    const boards = await project.related('kanbanBoards').query()
    return inertia.render('kanban/index', { project, boards })
  }

  @bindProject
  public async store({ request, response }: HttpContext, project: Project) {
    const kanbanBoard = await project.related('kanbanBoards').create(request.only(['name']))
    // Create default columns
    await kanbanBoard.related('columns').createMany([
      { name: 'TODO', order: 1 },
      { name: 'DOING', order: 2 },
      { name: 'DONE', order: 3 },
    ])

    return response.redirect().toPath(`/projects/${project.slug}/kanban/${kanbanBoard.slug}`)
  }

  @bindProjectAndKanbanBoard
  public async show({ inertia }: HttpContext, project: Project, board: KanbanBoard) {
    await board.load('columns', (query) => {
      query.preload('tasks')
    })
    return inertia.render('kanban/show', { project, board })
  }

  @bindProjectAndKanbanBoard
  public async edit({ inertia }: HttpContext, project: Project, board: KanbanBoard) {
    return inertia.render('kanban/edit', { project, board })
  }

  @bindProjectAndKanbanBoard
  public async update({ request, response }: HttpContext, _project: Project, board: KanbanBoard) {
    if (request.input('name')) {
      await board.merge({ name: request.input('name') }).save()
    }
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoard
  public async destroy({ response }: HttpContext, project: Project, board: KanbanBoard) {
    await board.delete()
    return response.redirect().toPath(`/projects/${project.slug}/kanban`)
  }
}
