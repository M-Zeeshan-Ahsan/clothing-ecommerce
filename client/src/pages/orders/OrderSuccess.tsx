import { Link, useParams } from "react-router-dom";

import "./OrderSuccess.scss";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <main className="order-success">
      <div className="order-success__container">
        <div className="order-success__icon">✓</div>

        <span className="order-success__subtitle">LIBAAS ORDER</span>

        <h1>Order Placed Successfully!</h1>

        <p className="order-success__message">
          Thank you for shopping with LIBAAS. Your order has been received and
          will be processed shortly.
        </p>

        <div className="order-success__order">
          <span>Order Number</span>
          <strong>#{id}</strong>
        </div>

        <div className="order-success__payment">
          <span>Payment Method</span>
          <strong>Cash on Delivery</strong>
        </div>

        <div className="order-success__actions">
          <Link to="/shop" className="order-success__shop">
            Continue Shopping
          </Link>

          <Link to="/" className="order-success__home">
            Back to Home
          </Link>
        </div>

        <p className="order-success__note">
          You will receive your order through Cash on Delivery. Please keep your
          phone available for delivery updates.
        </p>
      </div>
    </main>
  );
};

export default OrderSuccess;
