import vine from '@vinejs/vine'

export const settingsValidator = vine.compile(
  vine.object({
    // avatar: vine
    //   .file({
    //     size: '5mb',
    //     extnames: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'svg', 'bmp'],
    //   })
    //   .optional(),
    fullName: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().email().trim().normalizeEmail(),
    newPassword: vine
      .string()
      .minLength(8)
      .trim()
      .confirmed({ confirmationField: 'confirmPassword' })
      .optional(),
  })
)
