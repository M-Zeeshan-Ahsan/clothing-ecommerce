import { Link } from "react-router-dom";

import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice";

import { useAppDispatch, useAppSelector } from "../../store/store";

import "./Cart.scss";

const Cart = () => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  console.log("cartItems", cartItems);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <main className="cart cart--empty">
        <div className="cart__empty">
          <span className="cart__empty-icon">🛒</span>

          <h1>Your Cart Is Empty</h1>

          <p>Looks like you haven't added anything to your cart yet.</p>

          <Link to="/shop" className="cart__shop-button">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart">
      <div className="cart__header">
        <span>YOUR SHOPPING BAG</span>
        <h1>Shopping Cart</h1>
      </div>

      <section className="cart__container">
        <div className="cart__items">
          <div className="cart__items-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {cartItems.map((item) => (
            <div className="cart__item" key={item.product.id}>
              <div className="cart__product">
                <img src={item.product.image} alt={item.product.name} />

                <div>
                  <span>{item.product.category}</span>

                  <h3>{item.product.name}</h3>

                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart__price">
                Rs. {item.product.price.toLocaleString()}
              </div>

              <div className="cart__quantity">
                <button
                  type="button"
                  onClick={() => dispatch(decreaseQuantity(item.product.id))}
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => dispatch(increaseQuantity(item.product.id))}
                >
                  +
                </button>
              </div>

              <div className="cart__total">
                Rs. {(item.product.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          <div className="cart__actions">
            <Link to="/shop">Continue Shopping</Link>

            <button type="button" onClick={() => dispatch(clearCart())}>
              Clear Cart
            </button>
          </div>
        </div>

        <aside className="cart__summary">
          <h2>Order Summary</h2>

          <div className="cart__summary-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>

          <div className="cart__summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="cart__summary-divider" />

          <div className="cart__summary-total">
            <span>Total</span>
            <strong>Rs. {subtotal.toLocaleString()}</strong>
          </div>

          <button type="button" className="cart__checkout">
            Proceed to Checkout
          </button>

          <p className="cart__cod">Cash on Delivery available</p>
        </aside>
      </section>
    </main>
  );
};

export default Cart;
