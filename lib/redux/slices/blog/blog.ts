import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { BlogInterface } from "@/lib/interfaces/blog"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { blogsService, type GetBlogsParams } from "../blog/blog.service"
import type { BlogBaseFormData, UpdateBlogFormData } from "@/lib/validators/blog"


interface BlogState {
    blogs: BlogInterface[]
    selectedBlog?: BlogInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: BlogState = {
    blogs: [],
    selectedBlog: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getBlogs = createAsyncThunk(
    'blogs/getBlogs',
    async (params: GetBlogsParams): Promise<ApiResponse<BlogInterface[]> | undefined> => {
        try {
            const data = await blogsService.getBlogs(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createBlog = createAsyncThunk(
    'blogs/create',
    async (payload: BlogBaseFormData): Promise<BlogInterface | undefined> => {
        try {
            const data = await blogsService.createBlog(payload)
            const service = data?.data
            toaster.success("Blog created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getBlogById = createAsyncThunk<BlogInterface | undefined, GetByIdParams>(
    "blogs/getById",
    async ({id}): Promise<BlogInterface | undefined> => {
        try {
            const data = await blogsService.getBlogById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteBlog = createAsyncThunk<BlogInterface | undefined, GetByIdParams>(
    "blogs/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await blogsService.deleteBlog(id)
            toaster.success("Blog deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateBlog = createAsyncThunk<BlogInterface | undefined, UpdateParams<UpdateBlogFormData> >(
    "blogs/update",
    async ({id, payload}): Promise<BlogInterface | undefined> => {
        try {
            const data = await blogsService.updateBlog({
                id: id, 
                payload: payload
            })
            toaster.success("Blog updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setBlogs: (state, action) => {
            state.blogs = action.payload;
        },
        setSelectedBlog: (state, action) => {
            state.selectedBlog = action.payload
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
        .addCase(getBlogs.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getBlogs.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.blogs = payload?.data ?? [];
        })
        .addCase(getBlogs.rejected, (state) => {
            state.isLoading = false;
            state.blogs = [];
        })
        .addCase(getBlogById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getBlogById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedBlog = payload;
        })
        .addCase(getBlogById.rejected, (state) => {
            state.isLoading = false;
            state.selectedBlog = undefined;
        })
        .addCase(createBlog.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createBlog.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.blogs = [payload, ...state.blogs]
            }
        })
        .addCase(updateBlog.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateBlog.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.blogs) {
                const index = state.blogs.findIndex(blog => blog.id === payload.id);
                if (index !== -1) {
                    state.blogs[index] = payload;
                }
            }

            if (payload) {
                state.selectedBlog = payload;
            }
        })
        .addCase(deleteBlog.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(deleteBlog.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.blogs = state.blogs.filter(blog => blog.id !== deletedId);

            if (state.selectedBlog?.id === deletedId) {
                state.selectedBlog = undefined;
            }
        })
    }
})

export const { 
    setSelectedBlog, 
    setBlogs,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = blogSlice.actions;
export default blogSlice.reducer;
