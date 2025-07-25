import session from "../../../utils/session"
import toaster from "../../../utils/toaster"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileService } from "./profile.service";
import { ProcessError } from "../../../utils/Error";
import type { ProfileInterface } from "../../../interfaces/profile";
import type { ProfileFormData } from "../../../validators/profile";

interface AuthState {
    profile?: ProfileInterface
    isLoading: boolean
    message: string
}

const initialState: AuthState = {
  profile: undefined,
  isLoading: false,
  message: "",
};

export const updateProfile = createAsyncThunk(
    "profile/update",
    async (payload: FormData) => {
        try {
            const response = await profileService.updateProfile(payload)
            toaster.success(response.message)
            return response.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const getProfile = createAsyncThunk(
    "profile/get",
    async () => {
        try {
            const response = await profileService.getProfile()
            return response.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.message = "";
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(updateProfile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profile = action.payload;
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.message = action.error.message || "An error occurred";
        })
        .addCase(getProfile.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.profile = action.payload;
        })
        .addCase(getProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.message = action.error.message || "An error occurred";
        })
    }
})

export const { reset, setProfile } = profileSlice.actions
export default profileSlice.reducer