import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/RTK/api";
import authSlice from "./Reducers/authSlice";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
