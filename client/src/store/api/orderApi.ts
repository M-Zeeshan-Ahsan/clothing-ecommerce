import { baseApi } from "./baseApi";

// =========================
// CHECKOUT
// =========================

interface CheckoutAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
}

interface CheckoutItem {
  productId: number;
  quantity: number;
}

interface CheckoutRequest {
  address: CheckoutAddress;
  items: CheckoutItem[];
  paymentMethod: "COD";
}

interface CheckoutOrder {
  id: number;
  userId: number | null;
  totalAmount: number;
  status: string;
  paymentMethod: "COD";
  createdAt: string;
  updatedAt: string;
  addressId: number;
}

interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    order: CheckoutOrder;
    shippingAddress: CheckoutAddress;
    paymentMethod: "COD";
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
  };
}

// =========================
// ORDER PRODUCT
// =========================

interface OrderProduct {
  id: number;
  product_name: string;
  product_image: string;
  price: number;
  sale_price: number | null;
}

// =========================
// ORDER ITEM
// =========================

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: OrderProduct;
}

// =========================
// ORDER ADDRESS
// =========================

interface OrderAddress {
  id: number;
  userId: number | null;
  fullName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  postalCode: string | null;
  createdAt: string;
  updatedAt: string;
}

// =========================
// USER ORDER
// =========================

interface Order {
  id: number;
  userId: number;
  addressId: number;
  totalAmount: number;
  status: string;
  paymentMethod: "COD";
  createdAt: string;
  updatedAt: string;
  address: OrderAddress;
  items: OrderItem[];
}

// =========================
// USER ORDERS RESPONSE
// =========================

interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

// =========================
// ADMIN ORDER USER
// =========================

interface AdminOrderUser {
  id: number;
  name: string;
  email: string;
}

// =========================
// ADMIN ORDER
// =========================

interface AdminOrder {
  id: number;
  userId: number | null;
  addressId: number;
  totalAmount: number;

  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

  paymentMethod: "COD";

  createdAt: string;
  updatedAt: string;

  user: AdminOrderUser | null;
  address: OrderAddress;
  items: OrderItem[];
}

// =========================
// ADMIN ORDERS RESPONSE
// =========================

interface AdminOrdersResponse {
  success: boolean;
  message: string;

  data: {
    orders: AdminOrder[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface AdminOrderResponse {
  success: boolean;
  message: string;
  data: AdminOrder;
}

// =========================
// API
// =========================

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // CREATE CHECKOUT ORDER
    // =========================

    createCheckoutOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (data) => ({
        url: "/orders/checkout",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Product", "Order"],
    }),

    // =========================
    // GET LOGGED-IN USER ORDERS
    // =========================

    getOrders: builder.query<
      OrdersResponse,
      {
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/orders",

        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),

      providesTags: ["Order"],
    }),

    // =========================
    // GET SINGLE USER ORDER
    // =========================

    getOrderById: builder.query<OrderResponse, number>({
      query: (id) => `/orders/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Order",
          id,
        },
      ],
    }),

    // =========================
    // CANCEL USER ORDER
    // =========================

    cancelOrder: builder.mutation<OrderResponse, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
      }),

      invalidatesTags: ["Order"],
    }),

    // =========================
    // ADMIN - GET ALL ORDERS
    // =========================

    getAdminOrders: builder.query<
      AdminOrdersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      } | void
    >({
      query: (params) => ({
        url: "/admin/orders",

        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,

          ...(params?.search && {
            search: params.search,
          }),

          ...(params?.status &&
            params.status !== "ALL" && {
              status: params.status,
            }),
        },
      }),

      providesTags: ["Order"],
    }),

    // =========================
    // ADMIN - GET ORDER BY ID
    // =========================

    getAdminOrderById: builder.query<AdminOrderResponse, number>({
      query: (id) => `/admin/orders/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "Order",
          id,
        },
      ],
    }),

    // ADMIN - UPDATE ORDER STATUS
    updateAdminOrderStatus: builder.mutation<
      OrderResponse,
      {
        id: number;
        status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
      }
    >({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PUT",
        body: {
          status,
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "Order",
        {
          type: "Order",
          id,
        },
      ],
    }),
  }),
});

export const {
  // User
  useCreateCheckoutOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,

  // Admin
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
} = orderApi;
