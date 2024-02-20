import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'applications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable()
      table.string('project_id').references('projects.id').onDelete('CASCADE')
      table.string('slug').notNullable().unique()
      table.json('environment_variables').notNullable().defaultTo('{}')

      // Resources-related fields.
      table.string('cpu').nullable()
      table.string('ram').nullable()

      // Fly-related fields.
      table.string('shared_ipv4').nullable()
      table.string('ipv6').nullable()

      // GitHub-related columns.
      table.string('github_repository').nullable()
      table.string('github_branch').nullable()
      table.integer('github_installation_id').nullable()

      // Timestamps.
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
