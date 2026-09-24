import { baseApi } from "./baseApi";

interface CheckoutAddress {
  fullName: string;
  phone: string;
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

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (data) => ({
        url: "/orders/checkout",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateCheckoutOrderMutation } = orderApi;
