import env from '#start/env'
import { Docker } from 'node-docker-api'
import DockerEventsHandler from './docker_events_handler.js'

export default class DockerEventsWatcher {
  private readonly dockerEventsHandler = new DockerEventsHandler()

  constructor(private readonly docker: Docker) {}

  async watchEvents() {
    const stream = (await this.docker.events()) as any
    stream.on('data', (event: Buffer) => {
      try {
        const eventObject = JSON.parse(event.toString())
        this.dispatchEvent(eventObject)
      } catch {}
    })
  }

  dispatchEvent(eventObject: any) {
    const action = eventObject!.Action
    const image = eventObject!.Actor!.Attributes!.image
    const containerName: string = eventObject!.Actor!.Attributes!.name
    const applicationSlug = containerName.replace('-builder', '')

    if (action === 'die' && image === env.get('BUILDER_IMAGE', 'softwarecitadel/builder:latest')) {
      const exitCode = eventObject!.Actor!.Attributes!.exitCode
      if (exitCode === '0') {
        this.dockerEventsHandler.handleSuccessfulBuild(applicationSlug)
      } else {
        this.dockerEventsHandler.handleFailedBuild(applicationSlug)
      }
    }
  }
}
