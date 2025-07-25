import { BaseModelInterface } from "@/lib/interfaces/general";
import { FileInterface } from "@/lib/interfaces/file";

export interface ExperienceInterface extends BaseModelInterface {
  company: string;
  location: string;
  role: string;
  description?: string;
  start_date: string;
  end_date?: string ;
  file_id?: string ;
  company_logo?: FileInterface ;
}
