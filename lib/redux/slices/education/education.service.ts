import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { EducationInterface } from "@/lib/interfaces/education";
import API from "@/lib/utils/API";
import { EducationBaseFormData, UpdateEducationFormData } from "@/lib/validators/education";

export interface GetEducationsParams extends BaseGetParams {
  school?: string
};

const getEducations = async (params: GetEducationsParams): Promise<ApiResponse<EducationInterface[]>> => {
  const { data } = await API.get("/educations", { params });
  return data;
};

const getEducationById = async (id: string): Promise<ApiResponse<EducationInterface>> => {
    const { data } = await API.get(`/educations/${id}`)
    return data
}

const deleteEducation = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/educations/${id}`)
    return data
}

const createEducation = async (payload: EducationBaseFormData): Promise<ApiResponse<EducationInterface>> => {
    const { data } = await API.post(`/educations`, payload)
    return data
}

const updateEducation = async ({
    id,
    payload,
}: {id: string, payload: UpdateEducationFormData}
): Promise<ApiResponse<EducationInterface>> => {
    const { data } = await API.patch(`/educations/${id}`, payload)
    return data
}

export const educationsService = {
    getEducations,
    getEducationById,
    deleteEducation,
    createEducation,
    updateEducation
}
