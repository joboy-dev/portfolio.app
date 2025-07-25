import { z } from "zod"
import { richTextSchema } from "./general"

export const educationBaseSchema = z.object({
  school: z.string(),
  location: z.string(),
  degree: z.string().optional(),
  grade: z.string().optional(),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  file_id: z.string().optional(),
//   description: z.string().optional(),
  description: richTextSchema.optional(),
})

export const updateEducationSchema = educationBaseSchema.partial()

export type EducationBaseFormData = z.infer<typeof educationBaseSchema>
export type UpdateEducationFormData = z.infer<typeof updateEducationSchema>
