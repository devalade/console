import bindProject from '#decorators/bind_project'
import bindProjectAndDevMachine from '#decorators/bind_project_and_dev_machine'
import DevMachine from '#models/dev_machine'
import Project from '#models/project'
import { createDevMachineValidator } from '#validators/dev_machine'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

export default class DevMachinesController {
  @bindProject
  public async index({ inertia }: HttpContext, project: Project) {
    const devMachines = await project.related('devMachines').query()
    return inertia.render('dev_machines/index', { project, devMachines })
  }

  @bindProjectAndDevMachine
  public async store({ request, response }: HttpContext, project: Project) {
    const payload = await request.validateUsing(createDevMachineValidator)
    const devMachine = await project.related('devMachines').create(payload)
    emitter.emit('dev-machine:created', [project.organization, project, devMachine])

    return response.redirect().back()
  }

  @bindProjectAndDevMachine
  public async destroy({ response }: HttpContext, project: Project, devMachine: DevMachine) {
    await devMachine.delete()
    emitter.emit('dev-machine:deleted', [project.organization, project, devMachine])

    return response.redirect().back()
  }
}
