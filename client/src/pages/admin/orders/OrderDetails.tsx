import { useNavigate, useParams } from "react-router-dom";

import "./OrderDetails.scss";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "Nishat Boski Suit",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=200&q=80",
    price: 5480,
    quantity: 1,
  },
  {
    id: 2,
    name: "Premium Cotton Suit",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=200&q=80",
    price: 4200,
    quantity: 1,
  },
];

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryCharges = 250;
  const total = subtotal + deliveryCharges;

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
              <h1>Order #ORD-1001</h1>
              <p>Order ID: {id}</p>
            </div>

            <span className="admin-order-details__status">Pending</span>
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
              <div className="admin-order-details__avatar">A</div>

              <div>
                <strong>Ayesha Khan</strong>
                <span>ayesha@example.com</span>
                <span>+92 300 1234567</span>
              </div>
            </div>
          </section>

          {/* Products */}
          <section className="admin-order-details__card">
            <div className="admin-order-details__card-header">
              <h2>Order Items</h2>
              <span>{orderItems.length} Items</span>
            </div>

            <div className="admin-order-details__items">
              {orderItems.map((item) => (
                <div className="admin-order-details__item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="admin-order-details__item-info">
                    <strong>{item.name}</strong>
                    <span>Rs. {item.price.toLocaleString()}</span>
                  </div>

                  <span className="admin-order-details__quantity">
                    × {item.quantity}
                  </span>

                  <strong className="admin-order-details__item-total">
                    Rs. {(item.price * item.quantity).toLocaleString()}
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
              <strong>Ayesha Khan</strong>
              <p>
                House 123, Street 5
                <br />
                F-10, Islamabad
                <br />
                Pakistan
              </p>

              <span>Phone: +92 300 1234567</span>
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
              <label htmlFor="status">Update Status</label>

              <select id="status" defaultValue="Pending">
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button type="button">Update Status</button>
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
                <strong>Rs. {total.toLocaleString()}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
