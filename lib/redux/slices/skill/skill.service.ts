import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { SkillInterface } from "@/lib/interfaces/skill";
import API from "@/lib/utils/API";
import { SkillBaseFormData, UpdateSkillFormData } from "@/lib/validators/skill";

export interface GetSkillsParams extends BaseGetParams {
    name?: string;
};

const getSkills = async (params: GetSkillsParams): Promise<ApiResponse<SkillInterface[]>> => {
  const { data } = await API.get("/skills", { params });
  return data;
};

const getSkillById = async (id: string): Promise<ApiResponse<SkillInterface>> => {
    const { data } = await API.get(`/skills/${id}`)
    return data
}

const deleteSkill = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/skills/${id}`)
    return data
}

const createSkill = async (payload: SkillBaseFormData): Promise<ApiResponse<SkillInterface>> => {
    const { data } = await API.post(`/skills`, payload)
    return data
}

const updateSkill = async ({
    id,
    payload,
}: {id: string, payload: UpdateSkillFormData}
): Promise<ApiResponse<SkillInterface>> => {
    const { data } = await API.patch(`/skills/${id}`, payload)
    return data
}

export const skillsService = {
    getSkills,
    getSkillById,
    deleteSkill,
    createSkill,
    updateSkill
}
