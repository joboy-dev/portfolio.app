import { BaseModelInterface } from "@/lib/interfaces/general";
import { FileInterface } from "./file";

export interface AwardInterface extends BaseModelInterface {
  name: string;
  issuer: string;
  issue_date?: string;
  file_id?: string;
  issuer_image?: FileInterface;
}
