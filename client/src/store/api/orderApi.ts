import { baseApi } from "./baseApi";

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

interface OrderProduct {
  id: number;
  product_name: string;
  product_image: string;
  price: number;
  sale_price: number | null;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: OrderProduct;
}

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

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Checkout Order
    createCheckoutOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (data) => ({
        url: "/orders/checkout",
        method: "POST",
        body: data,
      }),
    }),

    // Get Logged-in User Orders
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

    // Get Single Order
    getOrderById: builder.query<OrderResponse, number>({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),

    // Cancel Order
    cancelOrder: builder.mutation<OrderResponse, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateCheckoutOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;
