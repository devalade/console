import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deployments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('application_id').references('applications.id').onDelete('CASCADE')
      table
        .enum('status', [
          'building',
          'build-failed',
          'deploying',
          'deployment-failed',
          'stopped',
          'success',
        ])
        .notNullable()
        .defaultTo('building')
      table.enum('origin', ['cli', 'github']).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
