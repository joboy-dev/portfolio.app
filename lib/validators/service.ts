import { z } from "zod"

export const serviceBaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  file_id: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
})

export const updateServiceSchema = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  file_id: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
})

export type ServiceBaseFormData = z.infer<typeof serviceBaseSchema>
export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>
