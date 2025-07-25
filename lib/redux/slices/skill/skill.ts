import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { SkillInterface } from "@/lib/interfaces/skill"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { skillsService, type GetSkillsParams } from "../skill/skill.service"
import type { SkillBaseFormData, UpdateSkillFormData } from "@/lib/validators/skill"


interface UpdateSkillParams extends UpdateParams<UpdateSkillFormData> {}

interface SkillState {
    skills: SkillInterface[]
    selectedSkill?: SkillInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: SkillState = {
    skills: [],
    selectedSkill: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getSkills = createAsyncThunk(
    'skills/getSkills',
    async (params: GetSkillsParams): Promise<ApiResponse<SkillInterface[]> | undefined> => {
        try {
            const data = await skillsService.getSkills(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createSkill = createAsyncThunk(
    'skills/create',
    async (payload: SkillBaseFormData): Promise<SkillInterface | undefined> => {
        try {
            const data = await skillsService.createSkill(payload)
            const service = data?.data
            toaster.success("Skill created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getSkillById = createAsyncThunk<SkillInterface | undefined, GetByIdParams>(
    "skills/getById",
    async ({id}): Promise<SkillInterface | undefined> => {
        try {
            const data = await skillsService.getSkillById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteSkill = createAsyncThunk<SkillInterface | undefined, GetByIdParams>(
    "skills/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await skillsService.deleteSkill(id)
            toaster.success("Skill deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateSkill = createAsyncThunk<SkillInterface | undefined, UpdateSkillParams>(
    "skills/update",
    async ({id, payload}): Promise<SkillInterface | undefined> => {
        try {
            const data = await skillsService.updateSkill({
                id: id, 
                payload: payload
            })
            toaster.success("Skill updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const skillSlice = createSlice({
    name: "skills",
    initialState,
    reducers: {
        setSkills: (state, action) => {
            state.skills = action.payload;
        },
        setSelectedSkill: (state, action) => {
            state.selectedSkill = action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload
        },
        setTotal: (state, action) => {
            state.total = action.payload
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getSkills.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getSkills.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.skills = payload?.data ?? [];
        })
        .addCase(getSkills.rejected, (state) => {
            state.isLoading = false;
            state.skills = [];
        })
        .addCase(getSkillById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getSkillById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedSkill = payload;
        })
        .addCase(getSkillById.rejected, (state) => {
            state.isLoading = false;
            state.selectedSkill = undefined;
        })
        .addCase(createSkill.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createSkill.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.skills = [payload, ...state.skills]
            }
        })
        .addCase(updateSkill.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateSkill.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.skills) {
                const index = state.skills.findIndex(skill => skill.id === payload.id);
                if (index !== -1) {
                    state.skills[index] = payload;
                }
            }

            if (payload) {
                state.selectedSkill = payload;
            }
        })
        .addCase(deleteSkill.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteSkill.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.skills = state.skills.filter(skill => skill.id !== deletedId);

            if (state.selectedSkill?.id === deletedId) {
                state.selectedSkill = undefined;
            }
        })
    }
})

export const { 
    setSelectedSkill, 
    setSkills,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = skillSlice.actions;
export default skillSlice.reducer;
