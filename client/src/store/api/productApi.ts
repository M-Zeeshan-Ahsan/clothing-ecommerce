import { baseApi } from "./baseApi";
import type { ProductsResponse } from "../../types/product";

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  newOnly?: boolean;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
        },
      }),

      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
