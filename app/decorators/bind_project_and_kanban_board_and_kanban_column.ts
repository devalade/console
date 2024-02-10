import KanbanBoard from '#models/kanban_board'
import KanbanColumn from '#models/kanban_column'
import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

export default function bindProjectAndKanbanBoardAndKanbanColumn(
  _target: any,
  _key: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, response, bouncer } = ctx
    let project: Project
    let kanbanBoard: KanbanBoard
    let kanbanColumn: KanbanColumn
    try {
      project = await Project.query().where('slug', params.projectSlug).firstOrFail()
      await project.load('organization')
      await bouncer.authorize('accessToProject', project)
      kanbanBoard = await project
        .related('kanbanBoards')
        .query()
        .where('slug', params.kanbanBoardSlug)
        .firstOrFail()
      kanbanColumn = await kanbanBoard
        .related('columns')
        .query()
        .where('id', params.kanbanColumnId)
        .firstOrFail()
    } catch {
      return response.notFound()
    }
    return await originalMethod.call(this, ctx, project, kanbanBoard, kanbanColumn)
  }
}
