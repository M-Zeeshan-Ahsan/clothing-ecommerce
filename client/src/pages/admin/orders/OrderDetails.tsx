import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
} from "../../../store/api/orderApi";

import { getApiErrorMessage } from "../../../utils/apiError";
import { showToast } from "../../../utils/toast";

import "./OrderDetails.scss";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const OrderDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const orderId = Number(id);

  const {
    data: orderResponse,
    isLoading,
    isError,
    error,
  } = useGetAdminOrderByIdQuery(orderId, {
    skip: !id || Number.isNaN(orderId),
  });

  const [updateAdminOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminOrderStatusMutation();

  const order = orderResponse?.data;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("PENDING");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status as OrderStatus);
    }
  }, [order]);

  useEffect(() => {
    if (isError) {
      showToast(getApiErrorMessage(error), "error");
    }
  }, [isError, error]);

  const handleStatusUpdate = async () => {
    if (!order) {
      return;
    }

    if (selectedStatus === order.status) {
      showToast("Please select a different status", "error");

      return;
    }

    try {
      await updateAdminOrderStatus({
        id: order.id,
        status: selectedStatus,
      }).unwrap();

      showToast("Order status updated successfully", "success");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  if (isLoading) {
    return (
      <div className="admin-order-details">
        <p>Loading order...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-order-details">
        <p>Failed to load order.</p>

        <button type="button" onClick={() => navigate("/admin/orders")}>
          ← Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-details">
        <p>Order not found.</p>

        <button type="button" onClick={() => navigate("/admin/orders")}>
          ← Back to Orders
        </button>
      </div>
    );
  }

  const customerName = order.user?.name ?? order.address?.fullName ?? "Guest";

  const customerEmail = order.user?.email ?? order.address?.email ?? "No email";

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = order.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const deliveryCharges = Number(order.totalAmount) - subtotal;

  return (
    <div className="admin-order-details">
      {/* Header */}

      <div className="admin-order-details__header">
        <div>
          <button
            type="button"
            className="admin-order-details__back"
            onClick={() => navigate("/admin/orders")}
          >
            ← Back to Orders
          </button>

          <div className="admin-order-details__title">
            <div>
              <h1>Order #ORD-{order.id}</h1>

              <p>Order ID: {order.id}</p>
            </div>

            <span
              className={`admin-order-details__status ${order.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-order-details__layout">
        {/* Main Content */}

        <div className="admin-order-details__main">
          {/* Customer */}

          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Customer Information</h2>
            </div>

            <div className="admin-order-details__customer">
              <div className="admin-order-details__avatar">
                {customerName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{customerName}</strong>

                <span>{customerEmail}</span>

                <span>{order.address.phone}</span>
              </div>
            </div>
          </section>

          {/* Products */}

          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Order Items</h2>

              <span>
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="admin-order-details__items">
              {order.items.map((item) => (
                <div className="admin-order-details__item" key={item.id}>
                  <img
                    src={item.product.product_image}
                    alt={item.product.product_name}
                  />

                  <div className="admin-order-details__item-info">
                    <strong>{item.product.product_name}</strong>

                    <span>Rs. {Number(item.price).toLocaleString()}</span>
                  </div>

                  <span className="admin-order-details__quantity">
                    × {item.quantity}
                  </span>

                  <strong className="admin-order-details__item-total">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Address */}

          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Shipping Address</h2>
            </div>

            <div className="admin-order-details__address">
              <strong>{order.address.fullName}</strong>

              <p>
                {order.address.address}
                <br />

                {order.address.city}

                {order.address.postalCode && (
                  <>
                    <br />
                    {order.address.postalCode}
                  </>
                )}
              </p>

              <span>Phone: {order.address.phone}</span>

              {order.address.email && <span>Email: {order.address.email}</span>}
            </div>
          </section>
        </div>

        {/* Sidebar */}

        <aside className="admin-order-details__sidebar">
          {/* Order Status */}

          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Order Status</h2>
            </div>

            <div className="admin-order-details__status-form">
              <label htmlFor="status">Current Status</label>

              <select
                id="status"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus)
                }
                disabled={isUpdatingStatus}
              >
                <option value="PENDING">Pending</option>

                <option value="CONFIRMED">Confirmed</option>

                <option value="SHIPPED">Shipped</option>

                <option value="DELIVERED">Delivered</option>

                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus || selectedStatus === order.status}
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </section>

          {/* Payment */}

          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Payment</h2>
            </div>

            <div className="admin-order-details__payment">
              <div>
                <span>Method</span>

                <strong>Cash on Delivery</strong>
              </div>

              <div>
                <span>Status</span>

                <strong className="unpaid">Unpaid</strong>
              </div>
            </div>
          </section>

          {/* Summary */}

          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Order Summary</h2>
            </div>

            <div className="admin-order-details__summary">
              <div>
                <span>Subtotal</span>

                <strong>Rs. {subtotal.toLocaleString()}</strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong>Rs. {deliveryCharges.toLocaleString()}</strong>
              </div>

              <div className="total">
                <span>Total</span>

                <strong>
                  Rs. {Number(order.totalAmount).toLocaleString()}
                </strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
