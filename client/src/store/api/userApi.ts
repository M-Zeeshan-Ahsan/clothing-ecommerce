import { baseApi } from "./baseApi";

export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
  };
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
}

interface UpdateAdminUserRoleRequest {
  id: number;
  role: UserRole;
}
interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
interface UpdateAdminUserRequest {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<
      AdminUsersResponse,
      GetAdminUsersParams | void
    >({
      query: (params) => ({
        url: "/admin/users",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          ...(params?.search && {
            search: params.search,
          }),
          ...(params?.role && {
            role: params.role,
          }),
        },
      }),

      providesTags: ["User"],
    }),

    getAdminUserById: builder.query<AdminUserResponse, number>({
      query: (id) => `/admin/users/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "User",
          id,
        },
      ],
    }),

    updateAdminUserRole: builder.mutation<
      AdminUserResponse,
      UpdateAdminUserRoleRequest
    >({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PUT",
        body: {
          role,
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "User",
        {
          type: "User",
          id,
        },
      ],
    }),
    createAdminUser: builder.mutation<
      AdminUserResponse,
      CreateAdminUserRequest
    >({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    updateAdminUser: builder.mutation<
      AdminUserResponse,
      UpdateAdminUserRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "User",
        { type: "User", id },
      ],
    }),
    deleteAdminUser: builder.mutation<
      { success: boolean; message: string; data: null },
      number
    >({
      query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useUpdateAdminUserRoleMutation,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = userApi;
