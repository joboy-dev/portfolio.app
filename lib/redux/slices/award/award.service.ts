import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { AwardInterface } from "@/lib/interfaces/award";
import API from "@/lib/utils/API";
import { AwardBaseFormData, UpdateAwardFormData } from "@/lib/validators/award";

export interface GetAwardsParams extends BaseGetParams {
  name?: string
};

const getAwards = async (params: GetAwardsParams): Promise<ApiResponse<AwardInterface[]>> => {
  const { data } = await API.get("/awards", { params });
  return data;
};

const getAwardById = async (id: string): Promise<ApiResponse<AwardInterface>> => {
    const { data } = await API.get(`/awards/${id}`)
    return data
}

const deleteAward = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/awards/${id}`)
    return data
}

const createAward = async (payload: AwardBaseFormData): Promise<ApiResponse<AwardInterface>> => {
    const { data } = await API.post(`/awards`, payload)
    return data
}

const updateAward = async ({
    id,
    payload,
}: {id: string, payload: UpdateAwardFormData}
): Promise<ApiResponse<AwardInterface>> => {
    const { data } = await API.patch(`/awards/${id}`, payload)
    return data
}

export const awardsService = {
    getAwards,
    getAwardById,
    deleteAward,
    createAward,
    updateAward
}
