import Certificate from '#models/certificate'
import vine from '@vinejs/vine'

export const addCertificateValidator = vine.compile(
  vine.object({
    domain: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/)
      .unique(async (_, value, field) => {
        const certificate = await Certificate.query()
          .where('domain', value)
          .where('application_id', field.meta.applicationId)
          .first()
        return certificate === null
      }),
  })
)
