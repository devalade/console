import vine from '@vinejs/vine'

export const createChannelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).toLowerCase(),
  })
)
