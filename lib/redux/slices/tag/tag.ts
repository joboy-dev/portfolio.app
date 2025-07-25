import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import type { 
    AttachOrDetatchTagFormData,
    CreateTagFormData, UpdateTagFormData,
} from "@/lib/validators/tag"
import toaster from "@/lib/utils/toaster"
import type { TagInterface } from "@/lib/interfaces/tag"
import { tagService, type GetTagsParams } from "./tag.service"

interface TagState {
    tags: TagInterface[]
    selectedTag?: TagInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: TagState = {
    tags: [],
    selectedTag: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 25,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getTags = createAsyncThunk(
    'tag/getTags',
    async (params: GetTagsParams): Promise<ApiResponse<TagInterface[]> | undefined> => {
        try {
            const data = await tagService.getTags(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createTag = createAsyncThunk(
    'tag/create',
    async (payload: CreateTagFormData): Promise<TagInterface | undefined> => {
        try {
            const data = await tagService.createTag(payload)
            toaster.success("Tag created successfully")
            return data?.data
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getTagById = createAsyncThunk<TagInterface | undefined, GetByIdParams>(
    "tag/getById",
    async ({id}): Promise<TagInterface | undefined> => {
        try {
            const data = await tagService.getTagById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteTag = createAsyncThunk<TagInterface | undefined, GetByIdParams>(
    "tag/delete",
    async ({id}): Promise<TagInterface | undefined> => {
        try {
            const data = await tagService.deleteTag(id)
            toaster.success("Tag deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateTag = createAsyncThunk<TagInterface | undefined, UpdateParams<UpdateTagFormData>>(
    "tag/update",
    async ({id, payload}): Promise<TagInterface | undefined> => {
        try {
            const data = await tagService.updateTag({
                id: id, 
                payload: payload
            })
            toaster.success("Tag updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const attachTagsToEntity = createAsyncThunk<any | undefined, AttachOrDetatchTagFormData>(
    "tag/attach",
    async (payload): Promise<any | undefined> => {
        try {
            const data = await tagService.attachTagsToEntity({payload})
            toaster.success("Tags attached successfully")
            return data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const detatchTagsFromEntity = createAsyncThunk<any | undefined, AttachOrDetatchTagFormData>(
    "tag/detatch",
    async (payload): Promise<any | undefined> => {
        try {
            const data = await tagService.detatchTagsFromEntity({payload})
            toaster.success("Tags detatched successfully")
            return data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const tagSlice = createSlice({
    name: "tag",
    initialState,
    reducers: {
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        setSelectedTag: (state, action) => {
            state.selectedTag = action.payload
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
        .addCase(getTags.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getTags.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.tags = payload?.data ?? [];
        })
        .addCase(getTags.rejected, (state) => {
            state.isLoading = false;
            state.tags = [];
        })
        .addCase(getTagById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getTagById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedTag = payload;
        })
        .addCase(getTagById.rejected, (state) => {
            state.isLoading = false;
            state.selectedTag = undefined;
        })
        .addCase(createTag.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createTag.fulfilled, (state, {payload}) => {
            state.isSubmitting = true;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.tags = [payload, ...state.tags]
            }
        })
        .addCase(updateTag.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateTag.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.tags) {
                const index = state.tags.findIndex(tag => tag.id === payload.id);
                if (index !== -1) {
                    state.tags[index] = payload;
                }
            }

            if (payload) {
                state.selectedTag = payload; // Optionally update the selectedTag too
            }
        })
        .addCase(deleteTag.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteTag.fulfilled, (state, {meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            const id = meta.arg.id

            state.tags = state.tags.filter(tag => tag.id !== id);

            if (state.selectedTag?.id === id) {
                state.selectedTag = undefined; // Optionally clear selected tag
            }
        })
        .addCase(attachTagsToEntity.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(attachTagsToEntity.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
        })
        .addCase(attachTagsToEntity.rejected, (state) => {
            state.isSubmitting = false;
        })
        .addCase(detatchTagsFromEntity.pending, (state) => {
            state.isSubmitting = true;
        })
    }
})

export const { 
    setSelectedTag, 
    setTags,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = tagSlice.actions;
export default tagSlice.reducer;