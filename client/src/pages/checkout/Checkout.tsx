import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearCart } from "../../store/slices/cartSlice";
import { useCreateCheckoutOrderMutation } from "../../store/api/orderApi";
import { getApiErrorMessage } from "../../utils/apiError";
import { showToast } from "../../utils/toast";

import "./Checkout.scss";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);

  const [createCheckoutOrder, { isLoading }] = useCreateCheckoutOrderMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const shippingFee = 199;
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createCheckoutOrder({
        address: formData,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        paymentMethod: "COD",
      }).unwrap();

      dispatch(clearCart());

      showToast(result.message, "success");

      navigate(`/order-success/${result.data.order.id}`);
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout checkout--empty">
        <div className="checkout__empty">
          <h1>Your Cart Is Empty</h1>

          <p>Add some products before proceeding to checkout.</p>

          <Link to="/shop">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="checkout__header">
        <span>LIBAAS CHECKOUT</span>
        <h1>Checkout</h1>
      </div>

      <form className="checkout__container" onSubmit={handleSubmit}>
        {/* Shipping Address */}
        <section className="checkout__form">
          <div className="checkout__section-header">
            <span>01</span>

            <div>
              <h2>Shipping Address</h2>
              <p>Enter the address where you want your order delivered.</p>
            </div>
          </div>

          <div className="checkout__fields">
            <div className="checkout__field">
              <label htmlFor="fullName">Full Name</label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout__field">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="03XX XXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout__field checkout__field--full">
              <label htmlFor="address">Complete Address</label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="House no, street, area"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout__field">
              <label htmlFor="city">City</label>

              <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout__field">
              <label htmlFor="postalCode">Postal Code</label>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="Optional"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="checkout__payment">
            <div className="checkout__section-header">
              <span>02</span>

              <div>
                <h2>Payment Method</h2>
                <p>Select your preferred payment method.</p>
              </div>
            </div>

            <label className="checkout__payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked
                readOnly
              />

              <div>
                <strong>Cash on Delivery</strong>
                <span>Pay when your order is delivered.</span>
              </div>
            </label>
          </div>
        </section>

        {/* Order Summary */}
        <aside className="checkout__summary">
          <h2>Order Summary</h2>

          <div className="checkout__products">
            {cartItems.map((item) => (
              <div className="checkout__product" key={item.product.id}>
                <img src={item.product.image} alt={item.product.name} />

                <div className="checkout__product-info">
                  <h3>{item.product.name}</h3>

                  <span>Qty: {item.quantity}</span>
                </div>

                <strong>
                  Rs. {(item.product.price * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout__divider" />

          <div className="checkout__summary-row">
            <span>Subtotal</span>

            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>

          <div className="checkout__summary-row">
            <span>Shipping</span>

            <span>Rs. {shippingFee.toLocaleString()}</span>
          </div>

          <div className="checkout__divider" />

          <div className="checkout__summary-total">
            <span>Total</span>

            <strong>Rs. {total.toLocaleString()}</strong>
          </div>

          <button
            type="submit"
            className="checkout__place-order"
            disabled={isLoading}
          >
            {isLoading ? "Placing Order..." : "Place Order"}
          </button>

          <p className="checkout__note">
            Your order will be confirmed after placing the order. Payment will
            be collected through Cash on Delivery.
          </p>

          <Link to="/cart" className="checkout__back">
            ← Back to Cart
          </Link>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;
