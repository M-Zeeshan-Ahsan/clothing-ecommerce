import { useMemo, useState } from "react";
import { products } from "../../data/products";
import ProductCard from "../../components/product/ProductCard";
import "./Shop.scss";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const categories = ["All", "Women", "Men", "Lawn", "Boski", "Cotton"];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Sorting
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
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <main className="shop">
      {/* Shop Hero */}
      <section className="shop-hero">
        <div className="shop-hero__content">
          <span>LIBAAS COLLECTION</span>

          <h1>Shop</h1>

          <p>Discover our latest collection of premium clothing.</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="shop-products">
        <div className="shop-products__header">
          <div>
            <span>OUR COLLECTION</span>

            <h2>
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
          </div>

          <p>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* Filters */}
        <div className="shop-filters">
          {/* Categories */}
          <div className="shop-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="shop-actions">
            <div className="shop-search">
              <input
                type="text"
                placeholder="Search products..."
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
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="shop-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <h3>No products found</h3>

            <p>Try another search or category.</p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Shop;
