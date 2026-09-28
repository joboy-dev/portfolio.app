import { z } from "zod"

export const serviceBaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  file_id: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  is_published: z.boolean().optional(),
})

export const updateServiceSchema = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  file_id: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  position: z.number().int().optional(),
  is_published: z.boolean().optional(),
})

export type ServiceBaseFormData = z.infer<typeof serviceBaseSchema>
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>
