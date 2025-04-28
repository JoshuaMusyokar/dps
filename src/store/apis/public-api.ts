// services/api.ts
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { LoginCredential, LoginResponse } from "../../types";
import { RootState } from "..";
import { addFlash } from "../slices/flash-slice";

const API_BASE_URL = "https://api.dynamicpaysolutions.com:7000/v1";
const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.dynamicpaysolutions.com:7000/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    const expiryAt = (getState() as RootState).auth.expiryAt;
    const issuedAt = (getState() as RootState).auth.issuedAt;
    // Check if token is expired
    if (token && expiryAt && new Date(expiryAt) < new Date()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("expiryAt");
      localStorage.removeItem("issuedAt");
      return headers;
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithFlash: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    // Handle different error statuses
    const errorData = result.error.data as { message?: string } | undefined;
    const errorMessage = errorData?.message || "An unknown error occurred";

    api.dispatch(
      addFlash({
        type: "error",
        message: errorMessage,
        duration: 5000,
      })
    );

    // You can add more specific error handling here
    if (result.error.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithFlash,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredential>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        // Store token and expiry in localStorage
        localStorage.setItem(
          "access_token",
          response.token_details.access_token
        );
        localStorage.setItem("issuedAt", response.token_details.issued_at);
        localStorage.setItem("expiresAt", response.token_details.expires_at);
        return response;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Login successful!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),

    // Protected endpoint example
    getProtectedData: builder.query({
      query: () => "/protected/data",
      extraOptions: { checkTokenExpiry: true },
    }),

    // Add more endpoints as needed
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useGetProtectedDataQuery } = api;
