import bindProjectAndKanbanBoardAndKanbanColumn from '#decorators/bind_project_and_kanban_board_and_kanban_column'
import bindProjectAndKanbanBoardAndKanbanColumnAndKanbanTask from '#decorators/bind_project_and_kanban_board_and_kanban_column_and_kanban_task'
import KanbanBoard from '#models/kanban_board'
import KanbanColumn from '#models/kanban_column'
import KanbanTask from '#models/kanban_task'
import Project from '#models/project'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class KanbanTasksController {
  @bindProjectAndKanbanBoardAndKanbanColumn
  public async store(
    { bouncer, request, response }: HttpContext,
    project: Project,
    _board: KanbanBoard,
    column: KanbanColumn
  ) {
    await bouncer.authorize('accessToProject', project)
    await column.load('tasks')
    await column
      .related('tasks')
      .create({ title: request.input('title'), order: column.tasks.length + 1 })
    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumnAndKanbanTask
  public async update(
    { bouncer, request, response }: HttpContext,
    project: Project,
    _board: KanbanBoard,
    _column: KanbanColumn,
    task: KanbanTask
  ) {
    await bouncer.authorize('accessToProject', project)

    if (request.input('columnId') !== undefined && request.input('order') !== undefined) {
      task.columnId = request.input('columnId')
      task.order = request.input('order')
      await task.save()

      // Let's increment the order of all the tasks that are >= to the new order
      await db
        .query()
        .from('kanban_tasks')
        .where('column_id', task.columnId)
        .where('order', '>=', task.order)
        .where('id', '!=', task.id)
        .increment('order', 1)

      return response.redirect().back()
    }

    if (request.input('order') !== undefined) {
      const existingTaskWithNewOrder = await KanbanTask.query()
        .where('order', request.input('order'))
        .first()
      if (existingTaskWithNewOrder) {
        existingTaskWithNewOrder.order = task.order
        await existingTaskWithNewOrder.save()
      }

      task.order = request.input('order')
      await task.save()
    }
    if (request.input('title')) {
      task.title = request.input('title')
      await task.save()
    }

    return response.redirect().back()
  }

  @bindProjectAndKanbanBoardAndKanbanColumnAndKanbanTask
  public async destroy(
    { bouncer, response }: HttpContext,
    project: Project,
    _board: KanbanBoard,
    _column: KanbanColumn,
    task: KanbanTask
  ) {
    await bouncer.authorize('accessToProject', project)
    await task.delete()
    return response.redirect().back()
  }
}
