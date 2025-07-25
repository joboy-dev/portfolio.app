import { createSlice } from "@reduxjs/toolkit";

interface Breadcrumb {
    title: string
    subtitle: string
}

interface GeneralState {
    breadcrumb?: Breadcrumb
    theme?: "light" | "dark"
}

const initialState: GeneralState = {
  breadcrumb: {
    title: "",
    subtitle: ""
  },
  theme: "light"
};


export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        setBreadcrumb: (state, { payload }) => {
            state.breadcrumb = payload;
        },
        setTheme: (state, { payload }) => {
            state.theme = payload;
        },
    },
})

export const { 
    setBreadcrumb,
    setTheme,
} = generalSlice.actions;
export default generalSlice.reducer;