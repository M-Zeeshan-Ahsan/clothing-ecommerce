import { baseApi } from "./baseApi";

import type {
  CategoriesResponse,
  CategoryResponse,
  CategoryRequest,
} from "../../types/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/category",

      providesTags: ["Category"],
    }),

    // Get single category
    getCategoryById: builder.query<CategoryResponse, number>({
      query: (id) => `/category/${id}`,

      providesTags: ["Category"],
    }),

    // Create category
    createCategory: builder.mutation<CategoryResponse, CategoryRequest>({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Category"],
    }),

    // Update category
    updateCategory: builder.mutation<
      CategoryResponse,
      {
        id: number;
        data: CategoryRequest;
      }
    >({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["Category"],
    }),

    // Delete category
    deleteCategory: builder.mutation<CategoryResponse, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
