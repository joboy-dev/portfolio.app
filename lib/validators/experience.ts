import { z } from "zod"
import { richTextSchema } from "./general"

export const experienceBaseSchema = z.object({
  company: z.string(),
  location: z.string(),
  role: z.string(),
//   description: z.string().optional(),
  description: richTextSchema.optional().nullable(),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  file_id: z.string().optional(),
})

export const updateExperienceSchema = experienceBaseSchema.partial()

export type ExperienceBaseFormData = z.infer<typeof experienceBaseSchema>
export type UpdateExperienceFormData = z.infer<typeof updateExperienceSchema>
