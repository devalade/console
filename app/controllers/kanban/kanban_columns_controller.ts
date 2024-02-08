import bindProjectAndKanbanBoard from '#decorators/bind_project_and_kanban_board'
import bindProjectAndKanbanBoardAndKanbanColumn from '#decorators/bind_project_and_kanban_board_and_kanban_column'
import KanbanBoard from '#models/kanban_board'
import KanbanColumn from '#models/kanban_column'
import Project from '#models/project'
import { HttpContext } from '@adonisjs/core/http'

export default class KanbanColumnsController {
  @bindProjectAndKanbanBoard
  public async store({ request, response }: HttpContext, _project: Project, board: KanbanBoard) {
    await board.load('columns')
    const order = board.columns.length + 1
    await board.related('columns').create({ ...request.only(['name']), order })
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumn
  public async update(
    { request, response }: HttpContext,
    _project: Project,
    board: KanbanBoard,
    column: KanbanColumn
  ) {
    const newOrder = request.input('order')
    if (!newOrder) return response.redirect().back()
    const oldOrder = column.order
    column.order = request.input('order')
    await column.save()

    // Update other columns' order
    const columns = await board.related('columns').query()
    const otherColumns = columns.filter((c) => c.id !== column.id)

    if (oldOrder < newOrder) {
      // Move column to the right
      for (const c of otherColumns) {
        if (c.order > oldOrder && c.order <= newOrder) {
          c.order = c.order - 1
          await c.save()
        }
      }
    } else {
      // Move column to the left
      for (const c of otherColumns) {
        if (c.order >= newOrder && c.order < oldOrder) {
          c.order = c.order + 1
          await c.save()
        }
      }
    }

    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumn
  public async destroy(
    { response }: HttpContext,
    _project: Project,
    _board: KanbanBoard,
    column: KanbanColumn
  ) {
    await column.delete()
    return response.redirect().back()
  }
}
