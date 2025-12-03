import { ProfileInterface } from "@/lib/interfaces/profile"
import { ApiResponse } from "@/lib/interfaces/response"
import API from "@/lib/utils/API"

const updateProfile = async (payload: FormData) : Promise<ApiResponse<ProfileInterface>> => {
    const { data } = await API.patch("/profile", payload)
    return data
}

const getProfile = async () : Promise<ApiResponse<ProfileInterface>> => {
    const { data } = await API.get("/profile")
    return data
}

export const profileService =  { updateProfile, getProfile }    