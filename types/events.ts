import Application from '#models/application'
import Database from '#models/database'
import Deployment from '#models/deployment'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'applications:created': Application
    'applications:deleted': Application

    'databases:created': Database
    'databases:deleted': Database

    'deployments:created': [Application, Deployment]
    [key: `deployments:updated:${string}`]: Deployment
  }
}
