import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/common/pagination/Pagination";

import "./Orders.scss";

interface AdminOrder {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  payment: "COD";
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

const dummyOrders: AdminOrder[] = [
  {
    id: 1,
    orderNumber: "#ORD-1001",
    customer: "Ayesha Khan",
    email: "ayesha@example.com",
    items: 2,
    total: 10960,
    payment: "COD",
    status: "Pending",
    date: "20 Sep 2026",
  },
  {
    id: 2,
    orderNumber: "#ORD-1002",
    customer: "Sara Ahmed",
    email: "sara@example.com",
    items: 1,
    total: 4200,
    payment: "COD",
    status: "Confirmed",
    date: "19 Sep 2026",
  },
  {
    id: 3,
    orderNumber: "#ORD-1003",
    customer: "Fatima Ali",
    email: "fatima@example.com",
    items: 3,
    total: 14500,
    payment: "COD",
    status: "Shipped",
    date: "18 Sep 2026",
  },
  {
    id: 4,
    orderNumber: "#ORD-1004",
    customer: "Hina Malik",
    email: "hina@example.com",
    items: 2,
    total: 8900,
    payment: "COD",
    status: "Delivered",
    date: "17 Sep 2026",
  },
  {
    id: 5,
    orderNumber: "#ORD-1005",
    customer: "Maham Raza",
    email: "maham@example.com",
    items: 1,
    total: 5480,
    payment: "COD",
    status: "Cancelled",
    date: "16 Sep 2026",
  },
  {
    id: 6,
    orderNumber: "#ORD-1006",
    customer: "Zara Noor",
    email: "zara@example.com",
    items: 2,
    total: 8400,
    payment: "COD",
    status: "Pending",
    date: "15 Sep 2026",
  },
  {
    id: 7,
    orderNumber: "#ORD-1007",
    customer: "Sana Iqbal",
    email: "sana@example.com",
    items: 1,
    total: 3450,
    payment: "COD",
    status: "Delivered",
    date: "14 Sep 2026",
  },
];

const ORDERS_PER_PAGE = 5;

const Orders = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return dummyOrders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search) ||
        order.customer.toLowerCase().includes(search) ||
        order.email.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

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
        </div>

        <select value={statusFilter} onChange={handleStatusFilter}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

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
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id}>
                  {/* Order */}
                  <td>
                    <strong className="admin-orders__order-number">
                      {order.orderNumber}
                    </strong>
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="admin-orders__customer">
                      <div className="admin-orders__avatar">
                        {order.customer.charAt(0)}
                      </div>

                      <div>
                        <strong>{order.customer}</strong>
                        <span>{order.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td>{order.items}</td>

                  {/* Total */}
                  <td>
                    <strong>Rs. {order.total.toLocaleString()}</strong>
                  </td>

                  {/* Payment */}
                  <td>
                    <span className="admin-orders__payment">
                      {order.payment}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`admin-orders__status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td>{order.date}</td>

                  {/* Actions */}
                  <td>
                    <div className="admin-orders__actions">
                      <button
                        type="button"
                        title="View Order"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        👁
                      </button>

                      <button type="button" title="Edit Status">
                        ✎
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
        Showing{" "}
        {paginatedOrders.length > 0
          ? `${(currentPage - 1) * ORDERS_PER_PAGE + 1}-${
              (currentPage - 1) * ORDERS_PER_PAGE + paginatedOrders.length
            }`
          : 0}{" "}
        of {filteredOrders.length} orders
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Orders;
