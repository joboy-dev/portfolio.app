import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { ServiceInterface } from "@/lib/interfaces/service";
import API from "@/lib/utils/API";
import { ServiceBaseFormData, UpdateServiceFormData } from "@/lib/validators/service";

export interface GetServicesParams extends BaseGetParams {
  name?: string;
};

const getServices = async (params: GetServicesParams): Promise<ApiResponse<ServiceInterface[]>> => {
  const { data } = await API.get("/services", { params });
  return data;
};

const getServiceById = async (id: string): Promise<ApiResponse<ServiceInterface>> => {
    const { data } = await API.get(`/services/${id}`)
    return data
}

const deleteService = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/services/${id}`)
    return data
}

const createService = async (payload: ServiceBaseFormData): Promise<ApiResponse<ServiceInterface>> => {
    const { data } = await API.post(`/services`, payload)
    return data
}

const updateService = async ({
    id,
    payload,
}: {id: string, payload: UpdateServiceFormData}
): Promise<ApiResponse<ServiceInterface>> => {
    const { data } = await API.patch(`/services/${id}`, payload)
    return data
}

export const servicesService = {
    getServices,
    getServiceById,
    deleteService,
    createService,
    updateService
}