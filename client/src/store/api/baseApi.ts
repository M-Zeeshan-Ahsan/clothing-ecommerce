import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,

    prepareHeaders: (headers, { getState, arg }) => {
      const state = getState() as RootState;

      const token = state.auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // =========================
      // JSON REQUEST
      // =========================
      //
      // FormData ke liye Content-Type
      // manually set nahi karna.
      //

      if (
        typeof arg !== "object" ||
        !("body" in arg) ||
        !(arg.body instanceof FormData)
      ) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),

  tagTypes: ["Product", "Category", "Profile", "Order", "User"],

  endpoints: () => ({}),
});
