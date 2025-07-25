import { BaseModelInterface } from "@/lib/interfaces/general";
import { FileInterface } from "./file";

export interface CertificationInterface extends BaseModelInterface {
  name: string;
  issuer: string;
  issue_date?: string;
  credential_id?: string;
  credential_url?: string;
  issuer_file_id?: string;
  issuer_image?: FileInterface;
  certification_file?: FileInterface;
}
