import { useMemo, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { products } from "../../data/products";

import "./Sale.scss";

const Sale = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const saleProducts = useMemo(() => {
    let result = products.filter((product) => product.badge === "Sale");

    if (searchTerm.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchTerm, sortBy]);

  return (
    <main className="sale">
      {/* Hero */}
      <section className="sale__hero">
        <div className="sale__hero-content">
          <span>LIMITED TIME OFFER</span>

          <h1>Sale</h1>

          <p>
            Discover exclusive styles at special prices. Shop your favorites
            before they're gone.
          </p>

          <a href="#sale-products" className="sale__hero-button">
            Shop Sale
          </a>
        </div>
      </section>

      {/* Products */}
      <section className="sale__products" id="sale-products">
        <div className="sale__header">
          <div>
            <span>EXCLUSIVE OFFERS</span>
            <h2>Sale Collection</h2>
          </div>

          <p>
            {saleProducts.length}{" "}
            {saleProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* Filters */}
        <div className="sale__filters">
          <div className="sale__search">
            <input
              type="text"
              placeholder="Search sale products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        {/* Product Grid */}
        {saleProducts.length > 0 ? (
          <div className="sale__grid">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="sale__empty">
            <h3>No sale products found</h3>

            <p>Try another search or browse our full collection.</p>

            <button type="button" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Sale;
