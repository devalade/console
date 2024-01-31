import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'certificates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('application_id')
        .references('id')
        .inTable('applications')
        .onDelete('CASCADE')
        .notNullable()
      table.string('domain').notNullable()
      table.enum('status', ['unconfigured', 'pending', 'configured']).defaultTo('unconfigured')
      table.json('dns_entries').notNullable().defaultTo('[]')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
