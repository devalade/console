import Organization from '#models/organization'
import AiFunctionsWrapper from '../../ai_functions_wrapper.js'
import AiFunction from '#decorators/ai_function'
import pg from 'pg'
import Channel from '#models/channel'
import User from '#models/user'
import emitter from '@adonisjs/core/services/emitter'
import Message from '#models/message'

/**
 * We cannot trust GPT-4 to avoid giving access to data from an unauthorized organization for the current user.
 * To avoid that, we have to make sure that AI functions only give access to data that the user has access to.
 * This is why we need to wrap the AI functions in a class that will be instantiated for each organization.
 */
export default function prepareAlbertaAiFunctions(
  organization: Organization,
  channel: Channel,
  user: User
) {
  class AlbertaAiFunctions extends AiFunctionsWrapper {
    @AiFunction('Ask user some question', {
      type: 'object',
      properties: {
        question: { type: 'string' },
      },
    })
    static async askQuestion({ question }: { question: string }) {
      /**
       * Send the question to the user.
       */
      await channel.related('messages').create({
        body: question,
        bot: 'Alberta',
        askedUserForAnswerId: user.id,
        userId: null,
      })

      /**
       * Hang on while the user has not answered the question.
       */
      emitter.on(
        `organizations:${organization.slug}:alberta:ask-for-answer`,
        (message: Message) => {
          if (message.userId === user.id) {
            return message.body
          }
        }
      )
    }

    @AiFunction('List projects for the current organization', {
      type: 'object',
      properties: {},
    })
    static async listProjects() {
      const projects = await organization.related('projects').query()

      return { projects }
    }

    @AiFunction('List databases for a given project', {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
      },
    })
    static async listDatabases({ projectId }: { projectId: string }) {
      const project = await organization
        .related('projects')
        .query()
        .where('id', projectId)
        .firstOrFail()
      const databases = await project.related('databases').query()

      return { databases }
    }

    @AiFunction('List tables for a given database', {
      type: 'object',
      properties: {
        organizationId: { type: 'string' },
        projectId: { type: 'string' },
        databaseId: { type: 'string' },
      },
    })
    static async listTables({ databaseId, projectId }: { databaseId: string; projectId: string }) {
      const project = await organization
        .related('projects')
        .query()
        .where('id', projectId)
        .firstOrFail()
      const database = await project
        .related('databases')
        .query()
        .where('id', databaseId)
        .firstOrFail()

      /**
       * If the database is a PostgreSQL database, we can use the `pg` package to list the tables.
       */
      if (database.dbms === 'postgres') {
        const pgClient = new pg.Client({
          user: database.username,
          host: database.hostname,
          database: database.name,
          password: database.password,
          port: 5432,
        })

        await pgClient.connect()
        const { rows } = await pgClient.query(
          'SELECT table_name FROM information_schema.tables WHERE table_schema = $1',
          ['public']
        )
        await pgClient.end()

        return { tables: rows }
      }

      if (database.dbms === 'mysql') {
        // TODO: Implement the same logic for MySQL
      }

      throw new Error('Unsupported DBMS')
    }

    @AiFunction(
      'Create a new table in a given database, with the given columns described in SQL (CREATE TABLE name (sqlColumns))',
      {
        type: 'object',
        properties: {
          projectSlug: { type: 'string' },
          databaseSlug: { type: 'string' },
          tableName: { type: 'string' },
          sqlColumns: { type: 'string' },
        },
      }
    )
    static async createTable({
      databaseSlug,
      projectSlug,
      tableName,
      sqlColumns,
    }: {
      organizationSlug: string
      projectSlug: string
      databaseSlug: string
      tableName: string
      sqlColumns: string
    }) {
      const project = await organization
        .related('projects')
        .query()
        .where('slug', projectSlug)
        .firstOrFail()
      const database = await project
        .related('databases')
        .query()
        .where('slug', databaseSlug)
        .firstOrFail()

      if (database.dbms === 'postgres') {
        const pgClient = new pg.Client({
          user: database.username,
          host: database.hostname,
          database: database.name,
          password: database.password,
          port: 5432,
        })

        await pgClient.connect()
        await pgClient.query(`CREATE TABLE ${tableName} (${sqlColumns});`)
        await pgClient.end()

        return { success: true }
      }

      if (database.dbms === 'mysql') {
        // TODO: Implement the same logic for MySQL
      }
    }
  }

  return AlbertaAiFunctions
}
