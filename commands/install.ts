import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readFile, writeFile } from 'fs/promises'

export default class Install extends BaseCommand {
  static commandName = 'install'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    const driver = await this.prompt.choice('Which driver should be used?', ['Docker', 'Fly'])
    let environmentVariables: Record<string, string>
    switch (driver) {
      case 'Docker':
        environmentVariables = await this.handleDocker()
        break
      case 'Fly':
        environmentVariables = await this.handleFly()
        break
    }

    const confirm = await this.prompt.confirm(
      `Are you sure you want to install Citadel with the ${driver} driver?`
    )
    if (!confirm) {
      this.logger.error('Installation aborted')
      return
    }

    const envExampleContents = await readFile('.env.example', 'utf-8')
    let envContents = envExampleContents
    for (const [key, value] of Object.entries(environmentVariables)) {
      envContents = envContents.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`)
      envContents = envContents.replace(new RegExp(`^# ${key}=$`, 'm'), `${key}=`)
    }
    await writeFile('.env', envContents)
  }

  private async handleDocker() {
    const environmentVariables: Record<string, string> = {}

    environmentVariables.TRAEFIK_WILDCARD_DOMAIN = await this.prompt.ask(
      'What domain should be used as a wildcard domain for Traefik?',
      {
        default: 'softwarecitadel.app',
      }
    )

    const customizeDockerSocket = await this.prompt.confirm(
      'Should the Docker socket be customized?'
    )
    if (customizeDockerSocket) {
      environmentVariables.DOCKER_SOCKET_PATH = await this.prompt.ask(
        'What is the path to the Docker socket?',
        {
          default: '/var/run/docker.sock',
        }
      )
    }

    environmentVariables.DRIVER = 'docker'

    return environmentVariables
  }

  private async handleFly() {
    const environmentVariables: Record<string, string> = {}

    environmentVariables.FLY_ORG = await this.prompt.ask('What is the Fly organization name?', {
      default: 'personal',
    })
    environmentVariables.FLY_TOKEN = await this.prompt.ask(
      'What is the Fly API token (`flyctl auth token`)?'
    )
    environmentVariables.FLY_APPLICATION_NAME_PREFIX = await this.prompt.ask(
      'What is the Fly application name prefix?',
      {
        default: 'citadel-app',
      }
    )
    environmentVariables.FLY_BUILDER_NAME_PREFIX = await this.prompt.ask(
      'What is the Fly builder name prefix?',
      {
        default: 'citadel-builder',
      }
    )
    environmentVariables.FLY_DATABASE_NAME_PREFIX = await this.prompt.ask(
      'What is the Fly database name prefix?',
      {
        default: 'citadel-db',
      }
    )
    environmentVariables.REGISTRY_HOST = 'registry.fly.io'

    environmentVariables.DRIVER = 'fly'

    return environmentVariables
  }
}
