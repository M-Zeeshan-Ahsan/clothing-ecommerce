import { useNavigate, useParams } from "react-router-dom";

import {
  useCancelOrderMutation,
  useGetOrderByIdQuery,
} from "../../store/api/orderApi";

import { getApiErrorMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";

import "./OrderDetails.scss";

const OrderDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const orderId = Number(id);

  const { data, isLoading, isError, error } = useGetOrderByIdQuery(orderId, {
    skip: !id || Number.isNaN(orderId),
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const order = data?.data;

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await cancelOrder(order.id).unwrap();

      showToast(result.message, "success");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  if (isLoading) {
    return (
      <main className="order-details-page">
        <div className="order-details-page__container">
          <div className="order-details-page__loading">Loading order...</div>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="order-details-page">
        <div className="order-details-page__container">
          <div className="order-details-page__error">
            <h2>Order Not Found</h2>

            <p>{getApiErrorMessage(error)}</p>

            <button onClick={() => navigate("/orders")}>Back to Orders</button>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = order.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const shippingFee = Number(order.totalAmount) - subtotal;

  return (
    <main className="order-details-page">
      <div className="order-details-page__container">
        {/* Header */}
        <div className="order-details-page__header">
          <button
            className="order-details-page__back"
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>

          <div className="order-details-page__title">
            <div>
              <span className="order-details-page__eyebrow">ORDER DETAILS</span>

              <h1>Order #{order.id}</h1>
            </div>

            <span
              className={`order-details-page__status order-details-page__status--${order.status.toLowerCase()}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <section className="order-details-page__summary">
          <div>
            <span>Order Date</span>

            <strong>
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>

          <div>
            <span>Payment Method</span>

            <strong>{order.paymentMethod}</strong>
          </div>

          <div>
            <span>Total Items</span>

            <strong>
              {order.items.reduce((total, item) => total + item.quantity, 0)}
            </strong>
          </div>

          <div>
            <span>Total Amount</span>

            <strong>Rs. {Number(order.totalAmount).toLocaleString()}</strong>
          </div>
        </section>

        {/* Main Content */}
        <div className="order-details-page__content">
          {/* Products */}
          <section className="order-details-page__section">
            <div className="order-details-page__section-header">
              <h2>Order Items</h2>

              <span>
                {order.items.length}{" "}
                {order.items.length === 1 ? "Product" : "Products"}
              </span>
            </div>

            <div className="order-details-page__items">
              {order.items.map((item) => (
                <div key={item.id} className="order-details-page__item">
                  <img
                    src={item.product.product_image}
                    alt={item.product.product_name}
                  />

                  <div className="order-details-page__item-info">
                    <h3>{item.product.product_name}</h3>

                    <span>Quantity: {item.quantity}</span>

                    <span>
                      Price: Rs. {Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <strong>
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Address */}
          <section className="order-details-page__section">
            <div className="order-details-page__section-header">
              <h2>Shipping Address</h2>
            </div>

            <div className="order-details-page__address">
              <strong>{order.address.fullName}</strong>

              <span>{order.address.phone}</span>

              {order.address.email && <span>{order.address.email}</span>}

              <span>{order.address.address}</span>

              <span>
                {order.address.city}
                {order.address.postalCode
                  ? `, ${order.address.postalCode}`
                  : ""}
              </span>
            </div>
          </section>

          {/* Price Summary */}
          <section className="order-details-page__section">
            <div className="order-details-page__section-header">
              <h2>Order Summary</h2>
            </div>

            <div className="order-details-page__prices">
              <div>
                <span>Subtotal</span>

                <strong>Rs. {subtotal.toLocaleString()}</strong>
              </div>

              <div>
                <span>Shipping</span>

                <strong>Rs. {shippingFee.toLocaleString()}</strong>
              </div>

              <div className="total">
                <span>Total</span>

                <strong>
                  Rs. {Number(order.totalAmount).toLocaleString()}
                </strong>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="order-details-page__actions">
            {order.status === "PENDING" && (
              <button
                className="order-details-page__cancel"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}

            <button
              className="order-details-page__continue"
              onClick={() => navigate("/shop")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
