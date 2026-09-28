import { useEffect, useState } from "react";

import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/common/pagination/Pagination";
import Loader from "../../components/common/loader/Loader";

import { useGetProductsQuery } from "../../store/api/productApi";
import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";

import "./NewArrivals.scss";

const NewArrivals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [limit] = useState(12);

  // =========================
  // GET NEW PRODUCTS
  // =========================

  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    page: currentPage,
    limit,
    search: searchTerm.trim(),
    newOnly: true,
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
  // SORT
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
  // SEARCH
  // =========================

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // =========================
  // CLEAR SEARCH
  // =========================

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="new-arrivals">
      {/* Hero */}
      <section className="new-arrivals__hero">
        <div className="new-arrivals__hero-content">
          <span>JUST DROPPED</span>

          <h1>New Arrivals</h1>

          <p>Explore the latest additions to the LIBAAS collection.</p>
        </div>
      </section>

      {/* Products */}
      <section className="new-arrivals__products">
        {/* Header */}
        <div className="new-arrivals__header">
          <div>
            <span>FRESH FROM LIBAAS</span>

            <h2>Latest Collection</h2>
          </div>

          <p>
            {pagination?.total ?? 0}{" "}
            {pagination?.total === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* Filters */}
        <div className="new-arrivals__filters">
          {/* Search */}
          <div className="new-arrivals__search">
            <input
              type="text"
              placeholder="Search new arrivals..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
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

        {/* Fetching */}
        {isFetching && !isLoading && (
          <div className="new-arrivals__loading">
            <Loader />
          </div>
        )}

        {/* Products */}
        {!isFetching && sortedProducts.length > 0 ? (
          <div className="new-arrivals__grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !isFetching && (
            <div className="new-arrivals__empty">
              <h3>No new arrivals found</h3>

              <p>Try another search.</p>

              <button type="button" onClick={handleClearSearch}>
                Clear Search
              </button>
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

export default NewArrivals;
