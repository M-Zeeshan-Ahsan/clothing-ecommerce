import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { addToCart } from "../../store/slices/cartSlice";
import { products } from "../../data/products";

import "./ProductDetails.scss";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const product = products.find((item) => item.id === Number(id));

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="product-details product-details--not-found">
        <h2>Product Not Found</h2>

        <p>The product you're looking for doesn't exist.</p>

        <Link to="/shop">Back to Shop</Link>
      </main>
    );
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }

    setQuantity(1);
  };

  const totalPrice = product.price * quantity;

  return (
    <main className="product-details">
      <div className="product-details__breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>

        <Link to="/shop">Shop</Link>
        <span>/</span>

        <span>{product.name}</span>
      </div>

      <section className="product-details__container">
        <div className="product-details__image-wrapper">
          {product.badge && (
            <span className="product-details__badge">{product.badge}</span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="product-details__image"
          />
        </div>

        <div className="product-details__info">
          <span className="product-details__category">{product.category}</span>

          <h1>{product.name}</h1>

          <div className="product-details__price">
            Rs. {product.price.toLocaleString()}
          </div>

          <p className="product-details__description">
            Discover premium quality and timeless style with our {product.name}.
            Carefully selected for comfort, quality and everyday elegance.
          </p>

          <div className="product-details__divider" />

          <div className="product-details__quantity">
            <span>Quantity</span>

            <div className="quantity-control">
              <button type="button" onClick={decreaseQuantity}>
                −
              </button>

              <span>{quantity}</span>

              <button type="button" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </div>

          <div className="product-details__total">
            <span>Total</span>

            <strong>Rs. {totalPrice.toLocaleString()}</strong>
          </div>

          <div className="product-details__actions">
            <button
              type="button"
              className="product-details__add"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button type="button" className="product-details__buy">
              Buy Now
            </button>
          </div>

          <div className="product-details__features">
            <div>
              <strong>Premium Quality</strong>
              <span>Original branded products</span>
            </div>

            <div>
              <strong>Cash on Delivery</strong>
              <span>Pay when your order arrives</span>
            </div>

            <div>
              <strong>Easy Returns</strong>
              <span>Simple return & exchange policy</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
