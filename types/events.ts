import Application from '#models/application'
import Database from '#models/database'
import Deployment from '#models/deployment'
import User from '#models/user'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'applications:created': Application
    'applications:deleted': Application

    'databases:created': Database
    'databases:deleted': Database

    'deployments:created': [Application, Deployment]
    'deployments:success': [Application, Deployment]
    'deployments:failure': [Application, Deployment]
    [key: `deployments:updated:${string}`]: Deployment

    'builds:success': [Application, Deployment]
    'builds:failure': [Application, Deployment]

    [key: `github:installation:${number}`]: User

    [key: `fly:log:${string}`]: { message: string; timestamp: string }
  }
}
