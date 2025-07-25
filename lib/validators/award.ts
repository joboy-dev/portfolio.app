import { z } from "zod"

export const awardBaseSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  issue_date: z.coerce.date().optional(),
  file_id: z.string().optional(),
})

export const updateAwardSchema = awardBaseSchema.partial()

export type AwardBaseFormData = z.infer<typeof awardBaseSchema>
export type UpdateAwardFormData = z.infer<typeof updateAwardSchema>
