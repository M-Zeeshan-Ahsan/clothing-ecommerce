import { baseApi } from "./baseApi";

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;

    orders: {
      pending: number;
      confirmed: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };

    totalSales: number;

    recentOrders: {
      id: number;
      totalAmount: number;
      status: string;
      createdAt: string;
      address: {
        fullName: string;
      };
    }[];
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => "/admin/dashboard",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
