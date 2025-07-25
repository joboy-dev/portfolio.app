import { z } from "zod"

// Assuming these are your URL schemas which can be empty string or null
const urlSchema = z.url("Invalid URL").optional().nullable().transform(e => e === '' ? null : e);

export const profileSchema = z.object({
    email: z.email().optional().nullable(),
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    phone_number: z.string().optional().nullable(),
    phone_country_code: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    short_bio: z.string().optional().nullable(),
    about: z.string().optional().nullable(),
    interests: z.array(z.string()).optional().nullable(),
    hobbies: z.array(z.string()).optional().nullable(),
    resume_url: urlSchema,
    github_url: urlSchema,
    linkedin_url: urlSchema,
    twitter_url: urlSchema,
    facebook_url: urlSchema,
    instagram_url: urlSchema,
    youtube_url: urlSchema,
    tiktok_url: urlSchema,
    whatsapp_url: urlSchema,
    website_url: urlSchema,
    file: z.any().optional().nullable()
    // file: z.instanceof(File).optional()
})

export type ProfileFormData = z.infer<typeof profileSchema>
