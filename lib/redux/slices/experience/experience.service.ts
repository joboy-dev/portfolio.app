import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { ExperienceInterface } from "@/lib/interfaces/experience";
import API from "@/lib/utils/API";
import { ExperienceBaseFormData, UpdateExperienceFormData } from "@/lib/validators/experience";

export interface GetExperiencesParams extends BaseGetParams {
  company?: string
};

const getExperiences = async (params: GetExperiencesParams): Promise<ApiResponse<ExperienceInterface[]>> => {
  const { data } = await API.get("/experiences", { params });
  return data;
};

const getExperienceById = async (id: string): Promise<ApiResponse<ExperienceInterface>> => {
    const { data } = await API.get(`/experiences/${id}`)
    return data
}

const deleteExperience = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/experiences/${id}`)
    return data
}

const createExperience = async (payload: ExperienceBaseFormData): Promise<ApiResponse<ExperienceInterface>> => {
    const { data } = await API.post(`/experiences`, payload)
    return data
}

const updateExperience = async ({
    id,
    payload,
}: {id: string, payload: UpdateExperienceFormData}
): Promise<ApiResponse<ExperienceInterface>> => {
    const { data } = await API.patch(`/experiences/${id}`, payload)
    return data
}

export const experiencesService = {
    getExperiences,
    getExperienceById,
    deleteExperience,
    createExperience,
    updateExperience
}
