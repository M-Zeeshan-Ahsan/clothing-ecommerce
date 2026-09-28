import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import "./Home.scss";
import { useOutletContext } from "react-router-dom";

import { useGetProductsQuery } from "../../store/api/productApi";
import { useGetCategoriesQuery } from "../../store/api/categoryApi";

import Loader from "../../components/common/loader/Loader";
import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import Pagination from "../../components/common/pagination/Pagination";
import useDebounce from "../../hooks/useDebounce";

interface SearchContext {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  const { searchTerm, setSearchTerm } = useOutletContext<SearchContext>();

  const debouncedSearch = useDebounce(searchTerm, 500);

  // =========================
  // CATEGORIES
  // =========================

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const categories = categoryData?.data ?? [];

  // =========================
  // PRODUCTS
  // =========================

  const {
    data: productData,
    isLoading: productsLoading,
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
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // =========================
  // LOADING
  // =========================

  if (productsLoading || categoriesLoading) {
    return <Loader />;
  }

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <span>NEW COLLECTION 2026</span>

          <h1>
            Timeless Style.
            <br />
            Modern Elegance.
          </h1>

          <p>Discover premium clothing crafted for everyday confidence.</p>

          <button>Shop Collection</button>
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="products-section__header">
          <div>
            <span>OUR COLLECTION</span>

            <h2>
              {searchTerm ? `Search: ${searchTerm}` : "Shop Our Products"}
            </h2>

            <p>{pagination?.total ?? 0} Products</p>
          </div>

          {/* Categories */}
          <div className="category-filter">
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
        </div>

        {/* Search */}
        <div className="product-search">
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
              className="product-search__clear"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <h3>No products found</h3>

            <p>We couldn't find anything matching "{searchTerm}"</p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
};

export default Home;
