import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'databases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').notNullable().unique()
      table.string('name').notNullable()
      table.enum('dbms', ['postgres', 'mysql', 'redis']).nullable()
      table.string('username').nullable()
      table.string('password').nullable()
      table.string('project_id').references('projects.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
