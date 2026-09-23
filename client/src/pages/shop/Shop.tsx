import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/common/pagination/Pagination";
import Loader from "../../components/common/loader/Loader";
import { useGetProductsQuery } from "../../store/api/productApi";
import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";

import "./Shop.scss";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [limit] = useState(12);

  const categories = ["All", "Women", "Men", "Lawn", "Boski", "Cotton"];

  // =========================
  // GET PRODUCTS
  // =========================

  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch.trim(),
    // categoryId: selectedCategory === "All" ? undefined : selectedCategory,
  });

  const products = data?.data.products ?? [];
  const pagination = data?.data.pagination;

  // =========================
  // ERROR
  // =========================

  useEffect(() => {
    if (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  }, [error]);

  // =========================
  // URL CATEGORY SYNC
  // =========================

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setCurrentPage(1);
  }, [categoryFromUrl]);

  // =========================
  // SORT PRODUCTS
  // =========================

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.current_price - b.current_price;
    }

    if (sortBy === "price-high") {
      return b.current_price - a.current_price;
    }

    if (sortBy === "name") {
      return a.product_name.localeCompare(b.product_name);
    }

    return 0;
  });

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    setCurrentPage(1);

    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category,
      });
    }
  };

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return <Loader />;
  }

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
        {/* Header */}
        <div className="shop-products__header">
          <div>
            <span>OUR COLLECTION</span>

            <h2>
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
          </div>

          <p>
            {pagination?.total ?? 0}{" "}
            {pagination?.total === 1 ? "Product" : "Products"}
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
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="shop-actions">
            {/* Search */}
            <div className="shop-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="featured">Featured</option>

              <option value="price-low">Price: Low to High</option>

              <option value="price-high">Price: High to Low</option>

              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Fetching Indicator */}
        {isFetching && !isLoading && (
          <div className="shop-loading">
            <Loader />
          </div>
        )}

        {/* Products */}
        {!isFetching && sortedProducts.length > 0 ? (
          <div className="shop-grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !isFetching && (
            <div className="shop-empty">
              <h3>No products found</h3>

              <p>Try another search or category.</p>

              <button onClick={handleClearFilters}>Clear Filters</button>
            </div>
          )
        )}

        {/* Pagination */}
        {!isFetching && sortedProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </main>
  );
};

export default Shop;
