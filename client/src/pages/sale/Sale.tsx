import { useEffect, useState } from "react";

import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/common/pagination/Pagination";
import Loader from "../../components/common/loader/Loader";

import { useGetProductsQuery } from "../../store/api/productApi";
import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";

import "./Sale.scss";

const Sale = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    page: currentPage,
    limit,
    search: searchTerm.trim(),
    saleOnly: true,
  });

  const saleProducts = data?.data.products ?? [];
  const pagination = data?.data.pagination;

  useEffect(() => {
    if (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  }, [error]);

  const sortedProducts = [...saleProducts].sort((a, b) => {
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  if (isLoading) {
    return <Loader />;
  }

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
            {pagination?.total ?? 0}{" "}
            {pagination?.total === 1 ? "Product" : "Products"}
          </p>
        </div>

        {/* Filters */}
        <div className="sale__filters">
          <div className="sale__search">
            <input
              type="text"
              placeholder="Search sale products..."
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

        {/* Loading */}
        {isFetching && !isLoading && (
          <div className="sale__loading">
            <Loader />
          </div>
        )}

        {/* Product Grid */}
        {!isFetching && sortedProducts.length > 0 ? (
          <div className="sale__grid">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !isFetching && (
            <div className="sale__empty">
              <h3>No sale products found</h3>

              <p>Try another search or browse our full collection.</p>

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

export default Sale;
