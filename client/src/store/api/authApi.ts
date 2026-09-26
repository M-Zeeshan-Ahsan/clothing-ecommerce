import { baseApi } from "./baseApi";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: "USER" | "ADMIN";
    };
    accessToken: string;
    refreshToken: string;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/users/profile",
      providesTags: ["Profile"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery } =
  authApi;
