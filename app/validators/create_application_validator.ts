import vine from '@vinejs/vine'

export const createApplicationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    githubRepository: vine.string().trim().minLength(3).maxLength(255).optional(),
    githubBranch: vine.string().trim().minLength(3).maxLength(255).optional(),
    githubInstallationId: vine.number().positive().optional(),
  })
)
