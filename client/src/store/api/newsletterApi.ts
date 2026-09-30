import { baseApi } from "./baseApi";

interface NewsletterResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    createdAt: string;
  };
}

interface NewsletterRequest {
  email: string;
}

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<
      NewsletterResponse,
      NewsletterRequest
    >({
      query: (body) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
