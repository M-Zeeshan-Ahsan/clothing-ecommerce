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

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Products
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

    // Get Product By ID
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [
        {
          type: "Product",
          id,
        },
      ],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
