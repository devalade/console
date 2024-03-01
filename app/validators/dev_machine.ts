import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new dev machine.
 */
export const createDevMachineValidator = vine.compile(
  vine.object({
    name: vine.string(),
    password: vine.string(),
    resourcesConfig: vine.enum(['standard', 'large'] as const),
  })
)
