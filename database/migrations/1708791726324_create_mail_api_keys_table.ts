import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mail_api_keys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable()
      table.string('value').notNullable()
      table
        .string('organization_id')
        .notNullable()
        .references('organizations.id')
        .onDelete('CASCADE')
      table.string('mail_domain_id').nullable().references('mail_domains.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
