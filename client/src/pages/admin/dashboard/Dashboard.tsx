import { useNavigate } from "react-router-dom";

import { useGetDashboardStatsQuery } from "../../../store/api/dashboardApi";
import { getApiErrorMessage } from "../../../utils/apiError";

import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__heading">
          <div>
            <span>OVERVIEW</span>
            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="admin-dashboard__loading">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__heading">
          <div>
            <span>OVERVIEW</span>
            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="admin-dashboard__error">
          <h2>Unable to load dashboard</h2>
          <p>{getApiErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  const stats = data?.data;

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
    },
    {
      title: "Total Sales",
      value: `Rs. ${Number(stats.totalSales).toLocaleString()}`,
    },
  ];

  const orderStatuses = [
    {
      label: "Pending",
      value: stats.orders.pending,
    },
    {
      label: "Confirmed",
      value: stats.orders.confirmed,
    },
    {
      label: "Shipped",
      value: stats.orders.shipped,
    },
    {
      label: "Delivered",
      value: stats.orders.delivered,
    },
    {
      label: "Cancelled",
      value: stats.orders.cancelled,
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Page Header */}
      <div className="admin-dashboard__heading">
        <div>
          <span>OVERVIEW</span>
          <h1>Dashboard</h1>
        </div>

        <p>Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="admin-dashboard__stats">
        {statCards.map((stat) => (
          <div key={stat.title} className="admin-dashboard__stat">
            <div className="admin-dashboard__stat-top">
              <span>{stat.title}</span>

              <div className="admin-dashboard__stat-icon">•</div>
            </div>

            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="admin-dashboard__grid">
        {/* Recent Orders */}
        <section className="admin-dashboard__orders">
          <div className="admin-dashboard__section-header">
            <div>
              <span>RECENT ACTIVITY</span>
              <h2>Recent Orders</h2>
            </div>

            <button type="button" onClick={() => navigate("/admin/orders")}>
              View All
            </button>
          </div>

          <div className="admin-dashboard__table-wrapper">
            {stats.recentOrders.length === 0 ? (
              <div className="admin-dashboard__empty-orders">
                <p>No orders found.</p>

                <button type="button" onClick={() => navigate("/admin/orders")}>
                  View Orders
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>

                      <td>{order.address.fullName}</td>

                      <td>Rs. {Number(order.totalAmount).toLocaleString()}</td>

                      <td>
                        <span
                          className={`status status--${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="admin-dashboard__summary">
          <div className="admin-dashboard__section-header">
            <div>
              <span>ORDERS</span>
              <h2>Order Status</h2>
            </div>
          </div>

          <div className="admin-dashboard__summary-list">
            {orderStatuses.map((status) => (
              <div key={status.label}>
                <span>{status.label}</span>

                <strong>{status.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
