import { BaseModelInterface } from "@/lib/interfaces/general";
import { FileInterface } from "@/lib/interfaces/file";

export interface EducationInterface extends BaseModelInterface {
  school: string;
  location: string;
  degree?: string;
  grade?: string;
  start_date: string;
  end_date?: string;
  file_id?: string;
  description?: string;
  school_logo?: FileInterface;
}
