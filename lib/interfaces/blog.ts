import { BaseModelInterface } from "@/lib/interfaces/general";
import type { TagInterface } from "@/lib/interfaces/tag";
import type { FileInterface } from "@/lib/interfaces/file";

export interface BlogInterface extends BaseModelInterface {
    title: string
    slug: string
    excerpt?: string
    content: string
    cover_image_url?: string
    is_published?: boolean
    published_at?: string
    files?: FileInterface[]
    tags?: TagInterface[]
}
