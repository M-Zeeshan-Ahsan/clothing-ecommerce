import type { Product } from "../../data/products";
import "./ProductCard.scss";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        {product.badge && (
          <span className="product-card__badge">{product.badge}</span>
        )}

        <button className="product-card__wishlist">♡</button>

        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />

        <button className="product-card__quick">Quick View</button>
      </div>

      <div className="product-card__content">
        <span className="product-card__category">{product.category}</span>

        <h3>{product.name}</h3>

        <div className="product-card__bottom">
          <span className="product-card__price">
            Rs. {product.price.toLocaleString()}
          </span>

          <button className="product-card__cart">+</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
