import vine from '@vinejs/vine'

export const updateKanbanColumnValidator = vine.compile(
  vine.object({
    order: vine.number().min(0).positive().optional(),
    name: vine.string().minLength(2).maxLength(200).optional(),
  })
)
