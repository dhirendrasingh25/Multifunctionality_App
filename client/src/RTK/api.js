import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = import.meta.env.VITE_SERVER_URL;
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: server, credentials: "include" }),
  tagTypes: ["USER"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/v1/user/login",
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/api/v1/user/new",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: ({ id }) => ({
        url: `/api/v1/user/profile/${id}`,
        method: "GET",
        withCredentials: true,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery } = api;
