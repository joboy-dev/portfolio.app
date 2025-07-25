#!/bin/bash

# Usage: bash create_module.sh <module_name>
# Example: bash create_module.sh book

if [ -z "$1" ]; then
  echo "Please provide a module name. Usage: bash create_module.sh <module_name>"
  exit 1
fi

MODULE_NAME=$1
CAP_MODULE_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}"

INTERFACE_FILE="lib/interfaces/${MODULE_NAME}.ts"
VALIDATOR_FILE="lib/validators/${MODULE_NAME}.ts"
SERVICE_FILE="lib/redux/slices/${MODULE_NAME}/${MODULE_NAME}.service.ts"
SLICE_FILE="lib/redux/slices/${MODULE_NAME}/${MODULE_NAME}.ts"

mkdir -p lib/interfaces lib/validators lib/redux/slices/${MODULE_NAME}

# Create interface file
cat > $INTERFACE_FILE <<EOL
import { BaseModelInterface } from "@/lib/interfaces/general";

export interface ${CAP_MODULE_NAME}Interface extends BaseModelInterface {

}
EOL

# Create validator file
cat > $VALIDATOR_FILE <<EOL
import { z } from "zod"

export const ${MODULE_NAME}BaseSchema = z.object({

})

export const update${CAP_MODULE_NAME}Schema = ${MODULE_NAME}BaseSchema.partial()

export type ${CAP_MODULE_NAME}BaseFormData = z.infer<typeof ${MODULE_NAME}BaseSchema>
export type Update${CAP_MODULE_NAME}FormData = z.infer<typeof update${CAP_MODULE_NAME}Schema>
EOL

# Create service file
cat > $SERVICE_FILE <<EOL
import { BaseGetParams } from "@/lib/interfaces/general";
import { ApiResponse } from "@/lib/interfaces/response";
import { ${CAP_MODULE_NAME}Interface } from "@/lib/interfaces/${MODULE_NAME}";
import API from "@/lib/utils/API";
import { ${CAP_MODULE_NAME}BaseFormData, Update${CAP_MODULE_NAME}FormData } from "@/lib/validators/${MODULE_NAME}";

export interface Get${CAP_MODULE_NAME}sParams extends BaseGetParams {
  // Add filter params here
};

const get${CAP_MODULE_NAME}s = async (params: Get${CAP_MODULE_NAME}sParams): Promise<ApiResponse<${CAP_MODULE_NAME}Interface[]>> => {
  const { data } = await API.get("/${MODULE_NAME}s", { params });
  return data;
};

const get${CAP_MODULE_NAME}ById = async (id: string): Promise<ApiResponse<${CAP_MODULE_NAME}Interface>> => {
    const { data } = await API.get(\`/${MODULE_NAME}s/\${id}\`)
    return data
}

const delete${CAP_MODULE_NAME} = async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await API.delete(\`/${MODULE_NAME}s/\${id}\`)
    return data
}

const create${CAP_MODULE_NAME} = async (payload: ${CAP_MODULE_NAME}BaseFormData): Promise<ApiResponse<${CAP_MODULE_NAME}Interface>> => {
    const { data } = await API.post(\`/${MODULE_NAME}s\`, payload)
    return data
}

const update${CAP_MODULE_NAME} = async ({
    id,
    payload,
}: {id: string, payload: Update${CAP_MODULE_NAME}FormData}
): Promise<ApiResponse<${CAP_MODULE_NAME}Interface>> => {
    const { data } = await API.patch(\`/${MODULE_NAME}s/\${id}\`, payload)
    return data
}

export const ${MODULE_NAME}sService = {
    get${CAP_MODULE_NAME}s,
    get${CAP_MODULE_NAME}ById,
    delete${CAP_MODULE_NAME},
    create${CAP_MODULE_NAME},
    update${CAP_MODULE_NAME}
}
EOL

# Create slice file
cat > $SLICE_FILE <<EOL
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProcessError } from "@/lib/utils/Error"
import type { ${CAP_MODULE_NAME}Interface } from "@/lib/interfaces/${MODULE_NAME}"
import type { ApiResponse } from "@/lib/interfaces/response"
import type { GetByIdParams, UpdateParams } from "@/lib/interfaces/general"
import toaster from "@/lib/utils/toaster"
import { ${MODULE_NAME}sService, type Get${CAP_MODULE_NAME}sParams } from "../${MODULE_NAME}/${MODULE_NAME}.service"
import type { ${CAP_MODULE_NAME}BaseFormData, Update${CAP_MODULE_NAME}FormData } from "@/lib/validators/${MODULE_NAME}"

interface Update${CAP_MODULE_NAME}Params extends UpdateParams<Update${CAP_MODULE_NAME}FormData> {}

interface ${CAP_MODULE_NAME}State {
    ${MODULE_NAME}s: ${CAP_MODULE_NAME}Interface[]
    selected${CAP_MODULE_NAME}?: ${CAP_MODULE_NAME}Interface
    total?: number
    currentPage?: number
    pageSize?: number
    totalPages?: number
    isLoading: boolean
    isSubmitting: boolean
    next?: string
    previous?: string
}

const initialState: ${CAP_MODULE_NAME}State = {
    ${MODULE_NAME}s: [],
    selected${CAP_MODULE_NAME}: undefined,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    isLoading: false,
    isSubmitting: false,
    next: undefined,
    previous: undefined,
}

export const get${CAP_MODULE_NAME}s = createAsyncThunk(
    '${MODULE_NAME}s/get${CAP_MODULE_NAME}s',
    async (params: Get${CAP_MODULE_NAME}sParams): Promise<ApiResponse<${CAP_MODULE_NAME}Interface[]> | undefined> => {
        try {
            const data = await ${MODULE_NAME}sService.get${CAP_MODULE_NAME}s(params)
            return data;
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const create${CAP_MODULE_NAME} = createAsyncThunk(
    '${MODULE_NAME}s/create',
    async (payload: ${CAP_MODULE_NAME}BaseFormData): Promise<${CAP_MODULE_NAME}Interface | undefined> => {
        try {
            const data = await ${MODULE_NAME}sService.create${CAP_MODULE_NAME}(payload)
            const service = data?.data
            toaster.success("${CAP_MODULE_NAME} created successfully")
            return service
        } catch (error) {
            ProcessError(error)
            return 
        }
    }
)

export const get${CAP_MODULE_NAME}ById = createAsyncThunk<${CAP_MODULE_NAME}Interface | undefined, GetByIdParams>(
    "${MODULE_NAME}s/getById",
    async ({id}): Promise<${CAP_MODULE_NAME}Interface | undefined> => {
        try {
            const data = await ${MODULE_NAME}sService.get${CAP_MODULE_NAME}ById(id)
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const delete${CAP_MODULE_NAME} = createAsyncThunk<${CAP_MODULE_NAME}Interface | undefined, GetByIdParams>(
    "${MODULE_NAME}s/delete",
    async ({id}): Promise<any | undefined> => {
        try {
            const data = await ${MODULE_NAME}sService.delete${CAP_MODULE_NAME}(id)
            toaster.success("${CAP_MODULE_NAME} deleted successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)

export const update${CAP_MODULE_NAME} = createAsyncThunk<${CAP_MODULE_NAME}Interface | undefined, Update${CAP_MODULE_NAME}Params>(
    "${MODULE_NAME}s/update",
    async ({id, payload}): Promise<${CAP_MODULE_NAME}Interface | undefined> => {
        try {
            const data = await ${MODULE_NAME}sService.update${CAP_MODULE_NAME}({
                id: id, 
                payload: payload
            })
            toaster.success("${CAP_MODULE_NAME} updated successfully")
            return data.data
        } catch (error) {
            ProcessError(error)
            return
        }
    }
)


export const ${MODULE_NAME}Slice = createSlice({
    name: "${MODULE_NAME}s",
    initialState,
    reducers: {
        set${CAP_MODULE_NAME}s: (state, action) => {
            state.${MODULE_NAME}s = action.payload;
        },
        setSelected${CAP_MODULE_NAME}: (state, action) => {
            state.selected${CAP_MODULE_NAME} = action.payload
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
        .addCase(get${CAP_MODULE_NAME}s.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(get${CAP_MODULE_NAME}s.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.total = payload?.pagination_data?.total
            state.totalPages = payload?.pagination_data?.pages
            state.pageSize = payload?.pagination_data?.size
            state.currentPage = payload?.pagination_data?.current_page
            state.next = payload?.pagination_data?.next_page
            state.previous = payload?.pagination_data?.previous_page
            state.${MODULE_NAME}s = payload?.data ?? [];
        })
        .addCase(get${CAP_MODULE_NAME}s.rejected, (state) => {
            state.isLoading = false;
            state.${MODULE_NAME}s = [];
        })
        .addCase(get${CAP_MODULE_NAME}ById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(get${CAP_MODULE_NAME}ById.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.selected${CAP_MODULE_NAME} = payload;
        })
        .addCase(get${CAP_MODULE_NAME}ById.rejected, (state) => {
            state.isLoading = false;
            state.selected${CAP_MODULE_NAME} = undefined;
        })
        .addCase(create${CAP_MODULE_NAME}.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(create${CAP_MODULE_NAME}.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) + 1
            if (payload) {
                state.${MODULE_NAME}s = [payload, ...state.${MODULE_NAME}s]
            }
        })
        .addCase(update${CAP_MODULE_NAME}.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(update${CAP_MODULE_NAME}.fulfilled, (state, {payload}) => {
            state.isSubmitting = false;

            if (payload && state.${MODULE_NAME}s) {
                const index = state.${MODULE_NAME}s.findIndex(${MODULE_NAME} => ${MODULE_NAME}.id === payload.id);
                if (index !== -1) {
                    state.${MODULE_NAME}s[index] = payload;
                }
            }

            if (payload) {
                state.selected${CAP_MODULE_NAME} = payload;
            }
        })
        .addCase(delete${CAP_MODULE_NAME}.pending, (state) => {
            state.isSubmitting = true;
        })
        .addCase(delete${CAP_MODULE_NAME}.fulfilled, (state, {payload, meta}) => {
            state.isSubmitting = false;
            state.total = (state.total ?? 0) - 1

            // Get the id from the thunk argument
            const deletedId = meta.arg.id;

            state.${MODULE_NAME}s = state.${MODULE_NAME}s.filter(${MODULE_NAME} => ${MODULE_NAME}.id !== deletedId);

            if (state.selected${CAP_MODULE_NAME}?.id === deletedId) {
                state.selected${CAP_MODULE_NAME} = undefined;
            }
        })
    }
})

export const { 
    setSelected${CAP_MODULE_NAME}, 
    set${CAP_MODULE_NAME}s,
    setCurrentPage,
    setPageSize,
    setTotal,
    setTotalPages
} = ${MODULE_NAME}Slice.actions;
export default ${MODULE_NAME}Slice.reducer;
EOL

echo "Module files for '$MODULE_NAME' created:"
echo "  - $INTERFACE_FILE"
echo "  - $VALIDATOR_FILE"
echo "  - $SERVICE_FILE"
echo "  - $SLICE_FILE"
