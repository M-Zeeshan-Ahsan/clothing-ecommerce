import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAppDispatch } from "../../store/store";
import { addToCart } from "../../store/slices/cartSlice";

import { useGetProductByIdQuery } from "../../store/api/productApi";

import Loader from "../../components/common/loader/Loader";

import "./ProductDetails.scss";

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const productId = Number(id);

  const { data, isLoading, isFetching, error } = useGetProductByIdQuery(
    productId,
    {
      skip: !productId,
    },
  );

  const product = data?.data;

  const [quantity, setQuantity] = useState(1);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <main className="product-details product-details--not-found">
        <h2>Product Not Found</h2>

        <p>
          The product you're looking for doesn't exist or is no longer
          available.
        </p>

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
      dispatch(
        addToCart({
          id: product.id,
          name: product.product_name,
          price: product.current_price,
          image: product.product_image,
          category: product.category.category_name,
          badge: product.badge ?? undefined,
        }),
      );
    }

    setQuantity(1);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.product_name,
          price: product.current_price,
          image: product.product_image,
          category: product.category.category_name,
          badge: product.badge ?? undefined,
        }),
      );
    }

    navigate("/checkout");
  };

  const totalPrice = product.current_price * quantity;

  const isSale = product.sale_price !== null;

  return (
    <main className="product-details">
      <div className="product-details__breadcrumb">
        <Link to="/">Home</Link>

        <span>/</span>

        <Link to="/shop">Shop</Link>

        <span>/</span>

        <span>{product.product_name}</span>
      </div>

      <section className="product-details__container">
        <div className="product-details__image-wrapper">
          {product.badge && (
            <span className="product-details__badge">{product.badge}</span>
          )}

          <img
            src={product.product_image}
            alt={product.product_name}
            className="product-details__image"
          />
        </div>

        <div className="product-details__info">
          <span className="product-details__category">
            {product.category.category_name}
          </span>

          <h1>{product.product_name}</h1>

          <div className="product-details__price">
            <strong>Rs. {product.current_price.toLocaleString()}</strong>

            {isSale && <del>Rs. {product.price.toLocaleString()}</del>}

            {isSale && (
              <span className="product-details__discount">
                {product.discount_percentage}% OFF
              </span>
            )}
          </div>

          {isSale && (
            <p className="product-details__saving">
              Save Rs. {product.saved_amount.toLocaleString()}
            </p>
          )}

          <p className="product-details__description">
            Discover premium quality and timeless style with our{" "}
            {product.product_name}. Carefully selected for comfort, quality and
            everyday elegance.
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

            <button
              type="button"
              className="product-details__buy"
              onClick={handleBuyNow}
            >
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
