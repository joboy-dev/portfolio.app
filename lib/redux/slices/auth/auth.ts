import session from "../../../utils/session"
import toaster from "../../../utils/toaster"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./auth.service";
import { ProcessError } from "../../../utils/Error";
import type { UserInterface } from "../../../interfaces/user";
import type { AuthFormData } from "../../../validators/auth";


interface AuthState {
    user?: UserInterface
    isLoading: boolean
    message: string
}

const initialState: AuthState = {
  user: undefined,
  isLoading: false,
  message: "",
};

export const login = createAsyncThunk(
    "auth/login", 
    async (payload: AuthFormData): Promise<UserInterface | undefined> => {
    try {
        const response = await authService.login(payload);
        const data = response.data;
        session.set("access_token", data.access_token);
        toaster.success(response.message);

        window.location.href = "/admin/profile";
        return data.user;
    } catch (error) {
        ProcessError(error);
        return;
    }
})

export const signUp = createAsyncThunk(
    "auth/signup",
    async (payload: AuthFormData): Promise<UserInterface | undefined> => {
        try {
            const response = await authService.signup(payload);
            const data = response.data;
            session.set("access_token", data.access_token);
            toaster.success(response.message);

            window.location.href = "/admin/profile";
            return data.user;
        } catch (error) {
            ProcessError(error);
            return;
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        try {
            const response = await authService.logout();
            session.remove("access_token");
            toaster.success(response.message);
            window.location.href = "/admin";
        } catch (error) {
            ProcessError(error);
        }
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.message = "";
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.user = payload;
        })
        .addCase(login.rejected, (state) => {
            state.isLoading = false;
            state.user = undefined;
            state.message = "An error occured";
        })
        .addCase(signUp.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(signUp.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.user = payload;
        })
        .addCase(signUp.rejected, (state) => {
            state.isLoading = false;
            state.user = undefined;
            state.message = "An error occured";
        })
        .addCase(logout.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(logout.fulfilled, (state) => {
            state.isLoading = false;
            state.user = undefined;
        })
    }
})

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;