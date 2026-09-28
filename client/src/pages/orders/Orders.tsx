import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCancelOrderMutation,
  useGetOrdersQuery,
} from "../../store/api/orderApi";
import { getApiErrorMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";
import Loader from "../../components/common/loader/Loader";

import "./Orders.scss";

const Orders = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useGetOrdersQuery({
    page: currentPage,
    limit,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = data?.data.orders ?? [];
  const pagination = data?.data.pagination;

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await cancelOrder(orderId).unwrap();

      showToast(result.message, "success");
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (pagination?.totalPages ?? 1)) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <main className="orders-page">
        <div className="orders-page__container">
          <div className="orders-page__error">
            <h2>Unable to load orders</h2>

            <p>{getApiErrorMessage(error)}</p>

            <button onClick={() => navigate("/")}>Continue Shopping</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-page__container">
        {/* Header */}
        <div className="orders-page__header">
          <span className="orders-page__eyebrow">MY ACCOUNT</span>

          <h1>My Orders</h1>

          <p>View your orders and track your purchases.</p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="orders-page__empty">
            <h2>No Orders Yet</h2>

            <p>You haven't placed any orders yet.</p>

            <button onClick={() => navigate("/shop")}>Start Shopping</button>
          </div>
        ) : (
          <>
            {/* Orders */}
            <div className="orders-page__list">
              {orders.map((order) => (
                <article key={order.id} className="orders-page__card">
                  {/* Order Header */}
                  <div className="orders-page__card-header">
                    <div>
                      <span>Order</span>

                      <strong>#{order.id}</strong>
                    </div>

                    <span
                      className={`orders-page__status orders-page__status--${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Info */}
                  <div className="orders-page__info">
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
                      <span>Items</span>

                      <strong>
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Payment</span>

                      <strong>{order.paymentMethod}</strong>
                    </div>

                    <div>
                      <span>Total</span>

                      <strong>
                        Rs. {Number(order.totalAmount).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="orders-page__products">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="orders-page__product">
                        <img
                          src={item.product.product_image}
                          alt={item.product.product_name}
                        />

                        <div>
                          <strong>{item.product.product_name}</strong>

                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <span className="orders-page__more">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="orders-page__actions">
                    <button
                      className="orders-page__details"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </button>

                    {order.status === "PENDING" && (
                      <button
                        className="orders-page__cancel"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="orders-page__pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>

                <div>
                  {Array.from(
                    {
                      length: pagination.totalPages,
                    },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Orders;
