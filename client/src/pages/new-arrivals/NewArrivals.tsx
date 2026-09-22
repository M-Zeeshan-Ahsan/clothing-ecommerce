import { useMemo, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { products } from "../../data/products";

import "./NewArrivals.scss";

const NewArrivals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const newProducts = useMemo(() => {
    let result = products.filter((product) => product.badge === "New");

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
    <main className="new-arrivals">
      <section className="new-arrivals__hero">
        <div className="new-arrivals__hero-content">
          <span>JUST DROPPED</span>

          <h1>New Arrivals</h1>

          <p>Explore the latest additions to the LIBAAS collection.</p>
        </div>
      </section>

      <section className="new-arrivals__products">
        <div className="new-arrivals__header">
          <div>
            <span>FRESH FROM LIBAAS</span>

            <h2>Latest Collection</h2>
          </div>

          <p>
            {newProducts.length}{" "}
            {newProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        <div className="new-arrivals__filters">
          <div className="new-arrivals__search">
            <input
              type="text"
              placeholder="Search new arrivals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm("")}>
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

        {newProducts.length > 0 ? (
          <div className="new-arrivals__grid">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="new-arrivals__empty">
            <h3>No new arrivals found</h3>

            <p>Try another search.</p>

            <button type="button" onClick={() => setSearchTerm("")}>
              Clear Search
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default NewArrivals;
