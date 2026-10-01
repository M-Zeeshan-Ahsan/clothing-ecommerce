import { baseApi } from "./baseApi";

interface ContactRequest {
  name: string;
  email?: string;
  phone: string;
  message: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}

interface ContactMessagesResponse {
  success: boolean;
  message: string;
  data: {
    messages: ContactMessage[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer - Create contact message
    createContactMessage: builder.mutation<ContactResponse, ContactRequest>({
      query: (data) => ({
        url: "/contact",
        method: "POST",
        body: data,
      }),
    }),

    // Admin - Get all contact messages
    getContactMessages: builder.query<
      ContactMessagesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/contact-messages?page=${page}&limit=${limit}`,
      providesTags: ["ContactMessage"],
    }),

    // Admin - Get single contact message
    getContactMessageById: builder.query<ContactResponse, number>({
      query: (id) => `/admin/contact-messages/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ContactMessage", id }],
    }),

    // Admin - Get unread count
    getUnreadContactMessageCount: builder.query<UnreadCountResponse, void>({
      query: () => "/admin/contact-messages/unread-count",
      providesTags: ["ContactMessage"],
    }),

    // Admin - Mark as read
    markContactMessageAsRead: builder.mutation<ContactResponse, number>({
      query: (id) => ({
        url: `/admin/contact-messages/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["ContactMessage"],
    }),

    // Admin - Delete
    deleteContactMessage: builder.mutation<ContactResponse, number>({
      query: (id) => ({
        url: `/admin/contact-messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactMessage"],
    }),
  }),
});

export const {
  useCreateContactMessageMutation,
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useGetUnreadContactMessageCountQuery,
  useMarkContactMessageAsReadMutation,
  useDeleteContactMessageMutation,
} = contactApi;
