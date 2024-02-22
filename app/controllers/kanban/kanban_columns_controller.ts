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
    firstColumn: KanbanColumn
  ) {
    const newOrder = request.input('order')
    const oldOrder = firstColumn.order

    const secondColumn = await KanbanColumn.query()
      .where('order', newOrder)
      .andWhere('board_id', board.id)
      .firstOrFail()

    firstColumn.order = newOrder
    secondColumn.order = oldOrder

    await Promise.all([firstColumn.save(), secondColumn.save()])

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
