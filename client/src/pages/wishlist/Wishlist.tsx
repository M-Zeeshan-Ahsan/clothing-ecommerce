import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/store";
import { removeFromWishlist } from "../../store/slices/wishlistSlice";
import { addToCart } from "../../store/slices/cartSlice";

import "./Wishlist.scss";

const Wishlist = () => {
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const handleAddToCart = (product: (typeof wishlistItems)[number]) => {
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
  };

  if (wishlistItems.length === 0) {
    return (
      <main className="wishlist wishlist--empty">
        <div className="wishlist__empty">
          <div className="wishlist__empty-icon">♡</div>

          <h1>Your Wishlist is Empty</h1>

          <p>Save your favorite products here and come back to them anytime.</p>

          <Link to="/shop" className="wishlist__shop-button">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist">
      <div className="wishlist__header">
        <div>
          <span className="wishlist__subtitle">YOUR FAVORITES</span>

          <h1>My Wishlist</h1>
        </div>

        <span className="wishlist__count">
          {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="wishlist__grid">
        {wishlistItems.map((product) => {
          const isSale = product.sale_price !== null;

          return (
            <article className="wishlist__card" key={product.id}>
              <div className="wishlist__image-wrapper">
                {product.badge && (
                  <span className="wishlist__badge">{product.badge}</span>
                )}

                <button
                  type="button"
                  className="wishlist__remove"
                  aria-label="Remove from wishlist"
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                >
                  ♥
                </button>

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="wishlist__image"
                  />
                </Link>
              </div>

              <div className="wishlist__content">
                <span className="wishlist__category">
                  {product.category.category_name}
                </span>

                <Link to={`/product/${product.id}`} className="wishlist__name">
                  {product.product_name}
                </Link>

                <div className="wishlist__price">
                  <strong>Rs. {product.current_price.toLocaleString()}</strong>

                  {isSale && <del>Rs. {product.price.toLocaleString()}</del>}

                  {isSale && <span>{product.discount_percentage}% OFF</span>}
                </div>

                <button
                  type="button"
                  className="wishlist__cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default Wishlist;
