import { z } from "zod"

export const certificationBaseSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  issue_date: z.date().optional().nullable(),
  credential_id: z.string().optional().nullable(),
  credential_url: z.string().optional().nullable(),
  issuer_file_id: z.string().optional().nullable(),
})

export const updateCertificationSchema = certificationBaseSchema.extend({
  position: z.number().optional().nullable(),
}).partial()

export type CertificationBaseFormData = z.infer<typeof certificationBaseSchema>
export type UpdateCertificationFormData = z.infer<typeof updateCertificationSchema>
