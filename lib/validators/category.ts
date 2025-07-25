import { z } from "zod"

export const CreateCategorySchema = z.object({
  name: z.string(),
  model_type: z.string(),
  description: z.string().optional(),
})

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})

export const AttachOrDetatchCategorySchema = z.object({
  category_ids: z.array(z.string()),
  entity_id: z.string(),
  model_type: z.string(),
})


export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>
export type AttachOrDetatchCategoryFormData = z.infer<typeof AttachOrDetatchCategorySchema>
