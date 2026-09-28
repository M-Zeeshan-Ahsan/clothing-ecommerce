import { baseApi } from "./baseApi";

import type { ProductResponse, ProductsResponse } from "../../types/product";

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  newOnly?: boolean;
  saleOnly?: boolean;
}

interface CreateProductRequest {
  product_name: string;
  product_image: string;
  categoryId: number;
  price: number;
  sale_price?: number | null;
}

interface UpdateProductRequest {
  id: number;
  product_name: string;
  product_image: string;
  categoryId: number;
  price: number;
  sale_price?: number | null;
}

interface AdminProductsParams {
  page?: number;
  limit?: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // USER - GET PRODUCTS
    // =========================

    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => ({
        url: "/products",

        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,

          ...(params?.search && {
            search: params.search,
          }),

          ...(params?.categoryId && {
            categoryId: params.categoryId,
          }),

          ...(params?.newOnly && {
            newOnly: true,
          }),

          ...(params?.saleOnly && {
            saleOnly: true,
          }),
        },
      }),

      providesTags: ["Product"],
    }),

    // =========================
    // USER - GET PRODUCT BY ID
    // =========================

    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Product",
          id,
        },
      ],
    }),

    // =========================
    // ADMIN - GET PRODUCTS
    // =========================

    getAdminProducts: builder.query<
      ProductsResponse,
      AdminProductsParams | void
    >({
      query: (params) => ({
        url: "/admin/products",

        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),

      providesTags: ["Product"],
    }),

    // =========================
    // ADMIN - CREATE PRODUCT
    // =========================

    createProduct: builder.mutation<ProductResponse, CreateProductRequest>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Product"],
    }),

    // =========================
    // ADMIN - UPDATE PRODUCT
    // =========================

    updateProduct: builder.mutation<ProductResponse, UpdateProductRequest>({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "Product",
        {
          type: "Product",
          id,
        },
      ],
    }),

    // =========================
    // ADMIN - DELETE PRODUCT
    // =========================

    deleteProduct: builder.mutation<ProductResponse, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
