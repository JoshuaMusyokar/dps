// services/api.ts
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  BankDetailsRequest,
  BankDetailsResponse,
  BusinessDetailsRequest,
  BusinessDetailsResponse,
  BusinessOnboarding,
  CreatePermission,
  CreatePermissionGroup,
  CreateRole,
  FinalSubmissionRequest,
  FinalSubmissionResponse,
  FormattedRoleWithPermissions,
  LoginCredential,
  LoginResponse,
  MappedUserRole,
  MapPermissionsToRoleReq,
  MapRolesToUserReq,
  MapRolesToUserRes,
  OwnerInfoRequest,
  OwnerInfoResponse,
  Permission,
  PermissionGroup,
  Role,
  RolePermissionMap,
  RolePermissionMapResponse,
  UpdateRole,
} from "../../types";
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
    const error = result.error;
    let errorMessage = "An error occurred";

    const errorData = error.data as
      | {
          message?: string;
          status_description?: string;
          details?: string[];
        }
      | undefined;

    // Handle known error types
    if (error.status === 401) {
      errorMessage =
        errorData?.message ||
        errorData?.status_description ||
        "Unauthorized access. Please login.";
    } else if (error.status === 403) {
      errorMessage =
        errorData?.message ||
        errorData?.status_description ||
        "You do not have permission to perform this action.";
    } else if (error.status === 404) {
      errorMessage =
        errorData?.message ||
        errorData?.status_description ||
        "Resource not found.";
    } else if (typeof error.status === "number" && error.status >= 500) {
      errorMessage =
        errorData?.message ||
        errorData?.status_description ||
        "Server error. Please try again later.";
    } else {
      // Use status_description or message if available
      errorMessage =
        errorData?.status_description || errorData?.message || errorMessage;
    }

    // 🔥 If there are validation `details`, show each as a separate flash
    if (errorData?.details && Array.isArray(errorData.details)) {
      for (const detail of errorData.details) {
        api.dispatch(
          addFlash({
            type: "error",
            message: detail,
            duration: 5000,
          })
        );
      }
    } else {
      // Fallback error message
      api.dispatch(
        addFlash({
          type: "error",
          message: errorMessage,
          duration: 5000,
        })
      );
    }

    // Optional: Redirect on 401, etc.
  }

  return result;
};
// Helper function to create FormData from business details
const createBusinessDetailsFormData = (
  data: Partial<BusinessDetailsRequest>
): FormData => {
  const formData = new FormData();

  // Add text fields
  if (data.registered_name)
    formData.append("registered_name", data.registered_name);
  if (data.trading_name) formData.append("trading_name", data.trading_name);
  if (data.physical_address)
    formData.append("physical_address", data.physical_address);
  if (data.city) formData.append("city", data.city);
  if (data.postal_code) formData.append("postal_code", data.postal_code);
  if (data.industry_sector)
    formData.append("industry_sector", data.industry_sector);
  if (data.business_type) formData.append("business_type", data.business_type);
  if (data.business_license_type)
    formData.append("business_license_type", data.business_license_type);
  if (data.other_license_type)
    formData.append("other_license_type", data.other_license_type);

  // Add file fields
  if (data.kra_pin_certificate)
    formData.append("kra_pin_certificate", data.kra_pin_certificate);
  if (data.business_license_file)
    formData.append("business_license_file", data.business_license_file);
  if (data.business_registration_cert)
    formData.append(
      "business_registration_cert",
      data.business_registration_cert
    );

  // Add additional documents
  if (data.additional_documents) {
    data.additional_documents.forEach((file, index) => {
      formData.append(`additional_documents`, file);
    });
  }

  return formData;
};

// Helper function to create FormData from owner info
const createOwnerInfoFormData = (data: Partial<OwnerInfoRequest>): FormData => {
  const formData = new FormData();

  if (data.first_name) formData.append("first_name", data.first_name);
  if (data.last_name) formData.append("last_name", data.last_name);
  if (data.email) formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);
  if (data.address) formData.append("address", data.address);
  if (data.id_number) formData.append("id_number", data.id_number);
  if (data.id_document) formData.append("id_document", data.id_document);
  if (data.address_proof) formData.append("address_proof", data.address_proof);
  if (data.passport_photo)
    formData.append("passport_photo", data.passport_photo);

  return formData;
};

// Helper function to create FormData from bank details
const createBankDetailsFormData = (
  data: Partial<BankDetailsRequest>
): FormData => {
  const formData = new FormData();

  if (data.bank_name) formData.append("bank_name", data.bank_name);
  if (data.account_number)
    formData.append("account_number", data.account_number);
  if (data.branch_code) formData.append("branch_code", data.branch_code);
  if (data.bank_statement)
    formData.append("bank_statement", data.bank_statement);

  return formData;
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
    createRole: builder.mutation<ApiResponse<Role>, CreateRole>({
      query: (credentials) => ({
        url: "/portal/rbac/roles",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Role created successful!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),
    createPermission: builder.mutation<
      ApiResponse<Permission>,
      CreatePermission
    >({
      query: (credentials) => ({
        url: "/portal/rbac/permission",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Permission created successful!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),
    createPermissionGroup: builder.mutation<
      ApiResponse<PermissionGroup>,
      CreatePermissionGroup
    >({
      query: (credentials) => ({
        url: "/portal/rbac/permission-groups",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Permission Group created successful!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),
    createRoleToUserMap: builder.mutation<
      ApiResponse<MappedUserRole[]>,
      { userId: string; roles: MapRolesToUserReq }
    >({
      query: ({ userId, roles }) => ({
        url: `/portal/rbac/users/${userId}/roles`,
        method: "POST",
        body: roles,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Roles mapped to user successfully!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),
    updateRole: builder.mutation<
      ApiResponse<Role>,
      { roleId: string; role: UpdateRole }
    >({
      query: ({ roleId, role }) => ({
        url: `/portal/rbac/roles/${roleId}`,
        method: "PUT",
        body: role,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Roles mapped to user successfully!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),
    createPermissionsToRoleMap: builder.mutation<
      ApiResponse<RolePermissionMapResponse[]>,
      { roleId: string; permissions: MapPermissionsToRoleReq }
    >({
      query: ({ roleId, permissions }) => ({
        url: `/portal/rbac/roles/${roleId}/permissions`,
        method: "POST",
        body: permissions,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            addFlash({
              type: "success",
              message: "Permissions mapped to Role successfully!",
              duration: 3000,
            })
          );
        } catch (_) {
          // Error is already handled by baseQueryWithFlash
        }
      },
    }),
    // Step 1: Submit Business Details
    submitBusinessDetails: builder.mutation<
      ApiResponse<BusinessDetailsResponse>,
      FormData
    >({
      query: (data) => ({
        url: "/portal/onboarding/registration_id/business",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["BusinessDetails"],
    }),

    // Step 2: Submit Owner Information
    submitOwnerInfo: builder.mutation<
      ApiResponse<OwnerInfoResponse>,
      Partial<OwnerInfoRequest>
    >({
      query: (data) => ({
        url: "owner-info",
        method: "POST",
        body: createOwnerInfoFormData(data),
      }),
      // invalidatesTags: ["OwnerInfo"],
    }),

    // Step 3: Submit Bank Details
    submitBankDetails: builder.mutation<
      ApiResponse<BankDetailsResponse>,
      Partial<BankDetailsRequest>
    >({
      query: (data) => ({
        url: "bank-details",
        method: "POST",
        body: createBankDetailsFormData(data),
      }),
      // invalidatesTags: ["BankDetails"],
    }),

    // Step 4: Final Submission
    submitFinalApplication: builder.mutation<
      ApiResponse<FinalSubmissionResponse>,
      FinalSubmissionRequest
    >({
      query: (data) => ({
        url: "submit",
        method: "POST",
        body: data,
      }),
      // invalidatesTags: ["Application"],
    }),

    // Protected endpoint example
    getProtectedData: builder.query({
      query: () => "/protected/data",
      extraOptions: { checkTokenExpiry: true },
    }),
    // Protected endpoint example
    getPermissions: builder.query<ApiResponse<Permission[]>, void>({
      query: () => "/portal/rbac/permission",
      extraOptions: { checkTokenExpiry: true },
    }),
    getRoles: builder.query<ApiResponse<Role[]>, void>({
      query: () => "/portal/rbac/roles",
    }),
    getOnboardingList: builder.query<ApiResponse<BusinessOnboarding[]>, void>({
      query: () => "/portal/onboarding/list",
    }),
    getPermissionGroups: builder.query<ApiResponse<PermissionGroup[]>, void>({
      query: () => "/portal/rbac/permission-groups",
    }),
    getMappedUsersRoles: builder.query<ApiResponse<MappedUserRole[]>, void>({
      query: () => "/portal/rbac/users/roles",
      // transformResponse: (response: any): ApiResponse<MappedUserRole[]> => response as ApiResponse<MappedUserRole[]>
    }),
    getRolesWithPermissions: builder.query<
      FormattedRoleWithPermissions[],
      void
    >({
      query: () => "/portal/rbac/roles/permissions",
      transformResponse: (response: any): FormattedRoleWithPermissions[] => {
        return response.details.map((item: RolePermissionMap) => ({
          role_id: item.role.role_id,
          role_name: item.role.role_name,
          role_description: item.role.role_description,
          is_active: item.role.is_active,
          permissions: item.permissions.map((p) => ({
            permission_id: p.permission_id,
            permission_name: p.permission_name,
            route: p.route,
            action: p.action,
            isActive: p.is_active,
          })),
        }));
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetOnboardingListQuery,
  useSubmitBusinessDetailsMutation,
  useUpdateRoleMutation,
  useCreatePermissionsToRoleMapMutation,
  useCreateRoleToUserMapMutation,
  useCreatePermissionGroupMutation,
  useCreateRoleMutation,
  useCreatePermissionMutation,
  useGetPermissionGroupsQuery,
  useGetRolesWithPermissionsQuery,
  useGetRolesQuery,
  useGetMappedUsersRolesQuery,
  useLoginMutation,
  useGetProtectedDataQuery,
  useGetPermissionsQuery,
} = api;
