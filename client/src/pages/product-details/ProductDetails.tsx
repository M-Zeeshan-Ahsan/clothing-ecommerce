import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/store";
import { addToCart } from "../../store/slices/cartSlice";

import { useGetProductByIdQuery } from "../../store/api/productApi";

import Loader from "../../components/common/loader/Loader";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { showToast } from "../../utils/toast";

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
  const cartItems = useAppSelector((state) => state.cart.items);

  const cartItem = product
    ? cartItems.find((item) => item.product.id === product.id)
    : undefined;

  const cartQuantity = cartItem?.quantity ?? 0;

  const isOutOfStock = product?.stock === 0;
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
    if (isOutOfStock) {
      showToast(`${product.product_name} is out of stock`, "error");
      return;
    }

    if (cartQuantity + quantity >= product.stock) {
      showToast(
        `${product.product_name}: Only ${product.stock} item${
          product.stock > 1 ? "s" : ""
        } available`,
        "error",
      );
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast(`${product.product_name} is out of stock`, "error");
      return;
    }

    if (cartQuantity + quantity > product.stock) {
      showToast(
        `${product.product_name}: Only ${product.stock - cartQuantity} item${
          product.stock - cartQuantity > 1 ? "s" : ""
        } available`,
        "error",
      );
      return;
    }

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

    showToast("Product added to cart", "success");
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      showToast(`${product.product_name} is out of stock`, "error");
      return;
    }

    if (cartQuantity + quantity > product.stock) {
      showToast(
        `${product.product_name}: Only ${product.stock - cartQuantity} item${
          product.stock - cartQuantity > 1 ? "s" : ""
        } available`,
        "error",
      );
      return;
    }

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
          {isOutOfStock ? (
            <span className="product-details__badge product-details__badge--out">
              OUT OF STOCK
            </span>
          ) : (
            product.badge && (
              <span className="product-details__badge">{product.badge}</span>
            )
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

              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`increase-quantity-${product.id}`}>
                    {isOutOfStock
                      ? `${product.product_name} is out of stock`
                      : cartQuantity + quantity >= product.stock
                        ? `${product.product_name}: Only ${product.stock} item${
                            product.stock > 1 ? "s" : ""
                          } available`
                        : "Increase Quantity"}
                  </Tooltip>
                }
              >
                <button type="button" onClick={increaseQuantity}>
                  +
                </button>
              </OverlayTrigger>
            </div>
          </div>

          <div className="product-details__total">
            <span>Total</span>

            <strong>Rs. {totalPrice.toLocaleString()}</strong>
          </div>

          <div className="product-details__actions">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`add-to-cart-${product.id}`}>
                  {isOutOfStock
                    ? `${product.product_name} is out of stock`
                    : cartQuantity + quantity > product.stock
                      ? `Only ${product.stock - cartQuantity} item${
                          product.stock - cartQuantity > 1 ? "s" : ""
                        } available`
                      : "Add to Cart"}
                </Tooltip>
              }
            >
              <button
                type="button"
                className="product-details__add"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`buy-now-${product.id}`}>
                  {isOutOfStock
                    ? `${product.product_name} is out of stock`
                    : cartQuantity + quantity > product.stock
                      ? `Only ${product.stock - cartQuantity} item${
                          product.stock - cartQuantity > 1 ? "s" : ""
                        } available`
                      : "Buy Now"}
                </Tooltip>
              }
            >
              <button
                type="button"
                className="product-details__buy"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </OverlayTrigger>
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
