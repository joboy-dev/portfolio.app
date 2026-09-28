import { z } from "zod"

export const skillBaseSchema = z.object({
  name: z.string(),
  proficiency: z.number().max(100),
  file_id: z.string().optional().nullable(),
  is_published: z.boolean().optional(),
})

export const updateSkillSchema = z.object({
  name: z.string().optional().nullable(),
  proficiency: z.number().max(100).optional().nullable(),
  file_id: z.string().optional().nullable(),
  position: z.number().optional().nullable(),
  is_published: z.boolean().optional(),
})

export type SkillBaseFormData = z.infer<typeof skillBaseSchema>
export type UpdateSkillFormData = z.infer<typeof updateSkillSchema>
