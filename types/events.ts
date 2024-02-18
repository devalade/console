import Application from '#models/application'
import Channel from '#models/channel'
import Conversation from '#models/conversation'
import Database from '#models/database'
import Deployment from '#models/deployment'
import Message from '#models/message'
import Organization from '#models/organization'
import Project from '#models/project'
import User from '#models/user'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'applications:created': [Organization, Project, Application]
    'applications:deleted': [Organization, Project, Application]

    'databases:created': [Organization, Project, Database]
    'databases:deleted': [Organization, Project, Database]

    'deployments:created': [Organization, Project, Application, Deployment]
    'deployments:success': [Application, Deployment]
    'deployments:failure': [Application, Deployment]
    [key: `deployments:updated:${string}`]: Deployment

    'builds:success': [Organization, Project, Application, Deployment]
    'builds:failure': [Application, Deployment]

    [key: `github:installation:${number}`]: User

    [key: `fly:log:${string}`]: { message: string; timestamp: string }

    [key: `organizations:${string}:message-update`]: Message
    [key: `organizations:${string}:message-delete`]: Message
    [key: `organizations:${string}:conversation-create`]: Conversation
    [key: `organizations:${string}:channel-update`]: Channel
    [key: `organizations:${string}:channel-delete`]: Channel
  }
}
