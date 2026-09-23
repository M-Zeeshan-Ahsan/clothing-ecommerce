import { Link } from "react-router-dom";
import "./ProductCard.scss";
import type { Product } from "../../types/product";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const isSale =
    product.sale_price !== null && product.sale_price !== undefined;

  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="product-card__image-wrapper">
        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}

        <button
          type="button"
          className="product-card__wishlist"
          aria-label="Add to wishlist"
        >
          ♡
        </button>

        <Link to={`/product/${product.id}`}>
          <img
            src={product.product_image}
            alt={product.product_name}
            className="product-card__image"
          />
        </Link>

        <Link to={`/product/${product.id}`} className="product-card__quick">
          Quick View
        </Link>
      </div>

      {/* Product Content */}
      <div className="product-card__content">
        <span className="product-card__category">
          {product.category.category_name}
        </span>

        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.product_name}
        </Link>

        {/* Price */}
        <div className="product-card__pricing">
          <div className="product-card__prices">
            <span className="product-card__price">
              Rs. {product.current_price.toLocaleString()}
            </span>

            {isSale && (
              <span className="product-card__old-price">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {isSale && (
            <span className="product-card__discount">
              {product.discount_percentage}% OFF
            </span>
          )}
        </div>

        {/* Saved Amount */}
        {isSale && (
          <span className="product-card__saving">
            Save Rs. {product.saved_amount.toLocaleString()}
          </span>
        )}

        {/* Bottom */}
        <div className="product-card__bottom">
          <button
            type="button"
            className="product-card__cart"
            aria-label={`Add ${product.product_name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
