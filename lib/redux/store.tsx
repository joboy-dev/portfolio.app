import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@/lib/redux/slices";

export const store = configureStore({
  reducer: rootReducer,
});

// export default store;
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
