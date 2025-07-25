import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { CertificationInterface } from "@/lib/interfaces/certification";
import API from "@/lib/utils/API";
import { CertificationBaseFormData, UpdateCertificationFormData } from "@/lib/validators/certification";

export interface GetCertificationsParams extends BaseGetParams {
  name?: string
};

const getCertifications = async (params: GetCertificationsParams): Promise<ApiResponse<CertificationInterface[]>> => {
  const { data } = await API.get("/certifications", { params });
  return data;
};

const getCertificationById = async (id: string): Promise<ApiResponse<CertificationInterface>> => {
    const { data } = await API.get(`/certifications/${id}`)
    return data
}

const deleteCertification = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/certifications/${id}`)
    return data
}

const createCertification = async (payload: CertificationBaseFormData): Promise<ApiResponse<CertificationInterface>> => {
    const { data } = await API.post(`/certifications`, payload)
    return data
}

const updateCertification = async ({
    id,
    payload,
}: {id: string, payload: UpdateCertificationFormData}
): Promise<ApiResponse<CertificationInterface>> => {
    const { data } = await API.patch(`/certifications/${id}`, payload)
    return data
}

export const certificationsService = {
    getCertifications,
    getCertificationById,
    deleteCertification,
    createCertification,
    updateCertification
}
