import { z } from "zod"

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(100).transform((v) => v.trim().toLowerCase()),
  model_type: z.string().min(1).max(100).transform((v) => v.trim().toLowerCase()),
})

export const UpdateTagSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim().toLowerCase() : v)),
  model_type: z
    .string()
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim().toLowerCase() : v)),
})

export const AttachOrDetatchTagSchema = z.object({
  tag_ids: z.array(z.string()),
  entity_id: z.string(),
  model_type: z.string(),
})


export type CreateTagFormData = z.infer<typeof CreateTagSchema>
export type UpdateTagFormData = z.infer<typeof UpdateTagSchema>
export type AttachOrDetatchTagFormData = z.infer<typeof AttachOrDetatchTagSchema>
