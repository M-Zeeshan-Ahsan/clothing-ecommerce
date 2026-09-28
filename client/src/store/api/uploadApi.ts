import { baseApi } from "./baseApi";

interface UploadImageResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
