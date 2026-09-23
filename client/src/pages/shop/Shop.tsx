import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import useDebounce from "../../hooks/useDebounce";

import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/common/pagination/Pagination";
import Loader from "../../components/common/loader/Loader";

import { useGetProductsQuery } from "../../store/api/productApi";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";

import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";

import "./Shop.scss";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // =========================
  // URL CATEGORY
  // =========================

  const categoryIdFromUrl = Number(searchParams.get("categoryId")) || undefined;

  // =========================
  // STATES
  // =========================

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(categoryIdFromUrl);

  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const [sortBy, setSortBy] = useState("featured");

  const [currentPage, setCurrentPage] = useState(1);

  const [limit] = useState(12);

  // =========================
  // GET CATEGORIES
  // =========================

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const categories = categoryData?.data ?? [];

  // =========================
  // GET PRODUCTS
  // =========================

  const {
    data: productData,
    isLoading: productsLoading,
    isFetching,
    error: productsError,
  } = useGetProductsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch.trim(),
    categoryId: selectedCategoryId,
  });

  const products = productData?.data.products ?? [];

  const pagination = productData?.data.pagination;

  // =========================
  // CATEGORY ERROR
  // =========================

  useEffect(() => {
    if (categoriesError) {
      showToast(getApiErrorMessage(categoriesError), "error");
    }
  }, [categoriesError]);

  // =========================
  // PRODUCT ERROR
  // =========================

  useEffect(() => {
    if (productsError) {
      showToast(getApiErrorMessage(productsError), "error");
    }
  }, [productsError]);

  // =========================
  // URL CATEGORY SYNC
  // =========================

  useEffect(() => {
    setSelectedCategoryId(categoryIdFromUrl);
    setCurrentPage(1);
  }, [categoryIdFromUrl]);

  // =========================
  // SELECTED CATEGORY NAME
  // =========================

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

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

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);

    if (categoryId === undefined) {
      setSearchParams({});
    } else {
      setSearchParams({
        categoryId: String(categoryId),
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
    setSelectedCategoryId(undefined);
    setSortBy("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  // =========================
  // LOADING
  // =========================

  if (productsLoading || categoriesLoading) {
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
              {selectedCategory
                ? selectedCategory.category_name
                : "All Products"}
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
            {/* All */}
            <button
              type="button"
              className={selectedCategoryId === undefined ? "active" : ""}
              onClick={() => handleCategoryChange(undefined)}
            >
              All
            </button>

            {/* Backend Categories */}
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={selectedCategoryId === category.id ? "active" : ""}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.category_name}
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
        {isFetching && !productsLoading && (
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

              <button type="button" onClick={handleClearFilters}>
                Clear Filters
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

export default Shop;
