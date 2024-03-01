import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new git repository.
 */
export const createGitRepositoryValidator = vine.compile(
  vine.object({})
)

/**
 * Validator to validate the payload when updating
 * an existing git repository.
 */
export const updateGitRepositoryValidator = vine.compile(
  vine.object({})
)