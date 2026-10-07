import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/common/pagination/Pagination";

import { useGetAdminOrdersQuery } from "../../../store/api/orderApi";

import { showToast } from "../../../utils/toast";
import { getApiErrorMessage } from "../../../utils/apiError";
import Loader from "../../../components/common/loader/Loader";

import "./Orders.scss";

const ORDERS_PER_PAGE = 10;

const Orders = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: orderData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAdminOrdersQuery({
    page: currentPage,
    limit: ORDERS_PER_PAGE,
    search: searchTerm.trim(),
    status: statusFilter,
  });

  const orders = orderData?.data.orders ?? [];

  const pagination = orderData?.data.pagination;

  useEffect(() => {
    if (isError) {
      showToast(getApiErrorMessage(error), "error");
    }
  }, [isError, error]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="admin-orders">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header */}

      <div className="admin-orders__header">
        <div>
          <h1>Orders</h1>

          <p>Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}

      <div className="admin-orders__filters">
        <div className="admin-orders__search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search order, customer..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              ×
            </button>
          )}
        </div>

        <select value={statusFilter} onChange={handleStatusFilter}>
          <option value="ALL">All Status</option>

          <option value="PENDING">Pending</option>

          <option value="CONFIRMED">Confirmed</option>

          <option value="SHIPPED">Shipped</option>

          <option value="DELIVERED">Delivered</option>

          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Updating */}

      {isFetching && (
        <div className="admin-orders__loading">
          <p>Updating orders...</p>
        </div>
      )}

      {/* Table */}

      <div className="admin-orders__table-wrapper">
        <table className="admin-orders__table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const customerName =
                  order.user?.name ?? order.address?.fullName ?? "Guest";

                const customerEmail =
                  order.user?.email ?? order.address?.email ?? "No email";

                const totalItems = order.items.reduce(
                  (total, item) => total + item.quantity,
                  0,
                );

                return (
                  <tr key={order.id}>
                    <td>
                      <strong className="admin-orders__order-number">
                        #ORD-{order.id}
                      </strong>
                    </td>

                    <td>
                      <div className="admin-orders__customer">
                        <div className="admin-orders__avatar">
                          {customerName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{customerName}</strong>

                          <span>{customerEmail}</span>
                        </div>
                      </div>
                    </td>

                    <td>{totalItems}</td>

                    <td>
                      <strong>
                        Rs. {Number(order.totalAmount).toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span className="admin-orders__payment">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-orders__status ${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td>
                      <div className="admin-orders__actions">
                        <button
                          type="button"
                          title="View Order"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          👁
                        </button>

                        <button
                          type="button"
                          title="Edit Status"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          ✎
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="admin-orders__empty">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="admin-orders__footer">
        Showing {orders.length} of {pagination?.total ?? 0} orders
      </div>

      {/* Pagination */}

      {!isFetching && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Orders;
