import vine from '@vinejs/vine'

export const createDatabaseValidator = vine.compile(
  vine.object({
    dbms: vine.enum(['postgres', 'mysql', 'redis']),
    name: vine.string().trim().minLength(3).maxLength(255),
    username: vine.string().trim().minLength(3).maxLength(255),
    password: vine.string().trim().minLength(3).maxLength(255),
  })
)
