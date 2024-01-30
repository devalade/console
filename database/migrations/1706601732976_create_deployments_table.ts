import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deployments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('application_id').unsigned().references('applications.id').onDelete('CASCADE')
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

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
