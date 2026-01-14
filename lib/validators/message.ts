import { z } from "zod"

const messageBaseFields = {
  name: z.string(),
  email: z.string().email(),
  phone_country_code: z.string().optional(),
  phone_number: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      { message: "Phone numbers must contain only digits" }
    ),
  message: z.string(),
  location: z.string().optional(),
};

export const messageBaseSchema = z.object(messageBaseFields)
  .refine(
    (data) => {
      if (data.phone_number && !data.phone_country_code) {
        return false
      }
      return true
    },
    { message: "phone_country_code is required when phone_number is provided", path: ["phone_country_code"] }
  )
  .refine(
    (data) => {
      if (data.phone_country_code && !data.phone_number) {
        return false
      }
      return true
    },
    { message: "phone_number is required when phone_country_code is provided", path: ["phone_number"] }
  )

export const updateMessageSchema = z.object({
  ...Object.fromEntries(
    Object.entries(messageBaseFields).map(([key, schema]) => [key, schema.optional()])
  ),
}).refine(
  (data) => {
    if (data.phone_number && !data.phone_country_code) {
      return false
    }
    return true
  },
  { message: "phone_country_code is required when phone_number is provided", path: ["phone_country_code"] }
).refine(
  (data) => {
    if (data.phone_country_code && !data.phone_number) {
      return false
    }
    return true
  },
  { message: "phone_number is required when phone_country_code is provided", path: ["phone_number"] }
)

export type MessageBaseFormData = z.infer<typeof messageBaseSchema>
export type UpdateMessageFormData = z.infer<typeof updateMessageSchema>
