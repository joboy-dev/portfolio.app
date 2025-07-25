import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { MessageInterface } from "@/lib/interfaces/message";
import API from "@/lib/utils/API";
import { MessageBaseFormData } from "@/lib/validators/message";

export interface GetMessagesParams extends BaseGetParams {
    name?: string;
    email?: string;
};

const getMessages = async (params: GetMessagesParams): Promise<ApiResponse<MessageInterface[]>> => {
  const { data } = await API.get("/messages", { params });
  return data;
};

const getMessageById = async (id: string): Promise<ApiResponse<MessageInterface>> => {
    const { data } = await API.get(`/messages/${id}`)
    return data
}

const deleteMessage = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(`/messages/${id}`)
    return data
}

const createMessage = async (payload: MessageBaseFormData): Promise<ApiResponse<MessageInterface>> => {
    const { data } = await API.post(`/messages/send`, payload)
    return data
}

export const messagesService = {
    getMessages,
    getMessageById,
    deleteMessage,
    createMessage
}
