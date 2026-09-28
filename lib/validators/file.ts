import { z } from "zod"

export const updateFileSchema = z.object({
  file_name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  label: z.string().optional().nullable().transform(v => typeof v === "string" ? v.trim().toLowerCase() : v),
  position: z.number().int().optional().nullable(),
})

export type UpdateFileFormData = z.infer<typeof updateFileSchema>

