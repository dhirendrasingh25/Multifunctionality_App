import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/RTK/auth";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authApi.middleware,
  ],
});
