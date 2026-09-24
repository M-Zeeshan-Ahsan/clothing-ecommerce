import { baseApi } from "./baseApi";

interface ContactRequest {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    message: string;
    createdAt: string;
  };
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContactMessage: builder.mutation<ContactResponse, ContactRequest>({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateContactMessageMutation } = contactApi;
