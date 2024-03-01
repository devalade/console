import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new analytics website.
 */
export const createAnalyticsWebsiteValidator = vine.compile(
  vine.object({
    domain: vine.string(),
  })
)
