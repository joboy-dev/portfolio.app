import { BaseModelInterface } from "./general";

export interface ProfileInterface extends BaseModelInterface {
    email: string
    first_name: string
    last_name: string
    title: string
    image_url: string
    phone_number?: string
    phone_country_code?: string
    city?: string
    state?: string
    country?: string
    address?: string
    short_bio?: string
    about?: string
    interests?: string[]
    hobbies?: string[]
    resume_url?: string
    github_url?: string
    linkedin_url?: string
    twitter_url?: string
    facebook_url?: string
    instagram_url?: string
    youtube_url?: string
    tiktok_url?: string
    whatsapp_url?: string
    website_url?: string
    projects_count?: number
    skills_count?: number
    full_name?: string
}