import bindProjectAndKanbanBoard from '#decorators/bind_project_and_kanban_board'
import bindProjectAndKanbanBoardAndKanbanColumn from '#decorators/bind_project_and_kanban_board_and_kanban_column'
import KanbanBoard from '#models/kanban_board'
import KanbanColumn from '#models/kanban_column'
import Project from '#models/project'
import { HttpContext } from '@adonisjs/core/http'
import { updateKanbanColumnValidator } from '#validators/kanban_column/update_kanban_column_validator'

export default class KanbanColumnsController {
  @bindProjectAndKanbanBoard
  async store({ request, response }: HttpContext, _project: Project, board: KanbanBoard) {
    await board.load('columns')
    const order = board.columns.length + 1
    await board.related('columns').create({ ...request.only(['name']), order })
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumn
  async update(
    { request, response }: HttpContext,
    _project: Project,
    board: KanbanBoard,
    firstColumn: KanbanColumn
  ) {
    if (request.input('name')) {
      await firstColumn
        .merge({
          name: request.input('name'),
        })
        .save()
    }

    if (request.input('order')) {
      const newOrder = request.input('order')
      const oldOrder = firstColumn.order

      const secondColumn = await KanbanColumn.query()
        .where('order', newOrder)
        .andWhere('board_id', board.id)
        .firstOrFail()

      firstColumn.order = newOrder
      secondColumn.order = oldOrder
      await secondColumn.save()
      await firstColumn.save()
    }

    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumn
  async destroy(
    { response }: HttpContext,
    _project: Project,
    _board: KanbanBoard,
    column: KanbanColumn
  ) {
    await column.delete()
    return response.redirect().back()
  }
}
