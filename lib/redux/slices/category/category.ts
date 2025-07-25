import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import type { 
    AttachOrDetatchCategoryFormData,
    CreateCategoryFormData, UpdateCategoryFormData,
} from "@/lib/validators/category"
import toaster from "@/lib/utils/toaster"
import type { CategoryInterface } from "@/lib/interfaces/category"
import { categoryService, type GetCategoriesParams } from "./category.service"

interface CategoryState {
    categories: CategoryInterface[]
    selectedCategory?: CategoryInterface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: CategoryState = {
    categories: [],
    selectedCategory: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 25,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (params: GetCategoriesParams): Promise<ApiResponse<CategoryInterface[]> | undefined> => {
        try {
            const data = await categoryService.getCategories(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const createCategory = createAsyncThunk(
    'category/create',
    async (payload: CreateCategoryFormData): Promise<CategoryInterface | undefined> => {
        try {
            const data = await categoryService.createCategory(payload)
            toaster.success("Category created successfully")
            return data?.data
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const getCategoryById = createAsyncThunk<CategoryInterface | undefined, GetByIdParams>(
    "category/getById",
    async ({id}): Promise<CategoryInterface | undefined> => {
        try {
            const data = await categoryService.getCategoryById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const deleteCategory = createAsyncThunk<CategoryInterface | undefined, GetByIdParams>(
    "category/delete",
    async ({id}): Promise<CategoryInterface | undefined> => {
        try {
            const data = await categoryService.deleteCategory(id)
            toaster.success("Category deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const updateCategory = createAsyncThunk<CategoryInterface | undefined, UpdateParams<UpdateCategoryFormData>>(
    "category/update",
    async ({id, payload}): Promise<CategoryInterface | undefined> => {
        try {
            const data = await categoryService.updateCategory({
                id: id, 
                payload: payload
            })
            toaster.success("Category updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const attachCategoriesToEntity = createAsyncThunk<any | undefined, AttachOrDetatchCategoryFormData>(
    "category/attach",
    async (payload): Promise<any | undefined> => {
        try {
            const data = await categoryService.attachCategoriesToEntity({payload})
            toaster.success("Categories attached successfully")
            return data
        } catch (error) {
            ProcessError(error)
            return
        }   
    }
)

export const detatchCategoriesFromEntity = createAsyncThunk<any | undefined, AttachOrDetatchCategoryFormData>(
    "category/detatch",
    async (payload): Promise<any | undefined> => {
        try {
            const data = await categoryService.detatchCategoriesFromEntity({payload})
            toaster.success("Categories detatched successfully")
            return data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

    export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
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
        .addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCategories.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.categories = payload?.data ?? [];
        })
        .addCase(getCategories.rejected, (state) => {
            state.isLoading = false;
            state.categories = [];
        })
        .addCase(getCategoryById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCategoryById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selectedCategory = payload;
        })
        .addCase(getCategoryById.rejected, (state) => {
            state.isLoading = false;
            state.selectedCategory = undefined;
        })
        .addCase(createCategory.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(createCategory.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.categories = [payload, ...state.categories]
            }
        })
        .addCase(updateCategory.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(updateCategory.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.categories) {
                const index = state.categories.findIndex(category => category.id === payload.id);
                if (index !== -1) {
                    state.categories[index] = payload;
                }
            }

            if (payload) {
                state.selectedCategory = payload; // Optionally update the selectedCategory too
            }
        })
        .addCase(deleteCategory.pending, (state) => {
            state.isSubmitting = true;
        })
            .addCase(deleteCategory.fulfilled, (state, {meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            const id = meta.arg.id

            state.categories = state.categories.filter(category => category.id !== id);

            if (state.selectedCategory?.id === id) {
                state.selectedCategory = undefined; // Optionally clear selected category
            }
        })
        .addCase(attachCategoriesToEntity.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(attachCategoriesToEntity.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
        })
        .addCase(attachCategoriesToEntity.rejected, (state) => {
            state.isSubmitting = false;
        })
        .addCase(detatchCategoriesFromEntity.pending, (state) => {
            state.isSubmitting = true;
        })
    }
})

export const { 
    setSelectedCategory, 
    setCategories,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = categorySlice.actions;
export default categorySlice.reducer;