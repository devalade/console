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
    const payload = await request.validateUsing(updateKanbanColumnValidator)
    if (payload.name) {
      await firstColumn
        .merge({
          name: payload.name,
        })
        .save()
    }

    if (payload.order) {
      const newOrder = payload.order
      const oldOrder = firstColumn.order

      const secondColumn = await KanbanColumn.query()
        .where('order', newOrder)
        .andWhere('board_id', board.id)
        .firstOrFail()

<<<<<<< HEAD
      firstColumn.order = newOrder
      secondColumn.order = oldOrder
      await secondColumn.save()
      await firstColumn.save()
    }
=======
    await Promise.all([firstColumn.save(), secondColumn.save()])
>>>>>>> 92adc0812f081ae4859508bcfbd549dd09bee88d

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
