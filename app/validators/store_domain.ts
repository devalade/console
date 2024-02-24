import vine from '@vinejs/vine'

export const storeDomainValidator = vine.compile(
  vine.object({
    domain: vine.string().trim().minLength(3).maxLength(255).toLowerCase().trim(),
  })
)
