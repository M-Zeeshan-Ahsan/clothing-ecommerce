import { useEffect, useState, useRef } from "react";
import ProductCard from "../../components/product/ProductCard";
import "./Home.scss";
import { useOutletContext } from "react-router-dom";

import { useGetProductsQuery, type Season } from "../../store/api/productApi";
import ProductFilterDrawer from "../../components/product/ProductFilterDrawer";

import Loader from "../../components/common/loader/Loader";
import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
import Pagination from "../../components/common/pagination/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { HOME_HIGHLIGHTS } from "../../utils/constant";
import SEO from "../../components/common/SEO";
interface SearchContext {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Home = () => {
  const productsSectionRef = useRef<HTMLElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    undefined,
  );
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();

  const { searchTerm, setSearchTerm } = useOutletContext<SearchContext>();

  const debouncedSearch = useDebounce(searchTerm, 500);

  // =========================
  // PRODUCTS
  // =========================

  const {
    currentData: productData,
    isFetching: productsFetching,
    error: productsError,
  } = useGetProductsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch.trim(),
    categoryId: selectedCategoryId,
    season: selectedSeason,
    brand: selectedBrand,
  });

  const products = productData?.data.products ?? [];
  const pagination = productData?.data.pagination;

  // =========================
  // PRODUCT ERROR
  // =========================

  useEffect(() => {
    if (productsError) {
      showToast(getApiErrorMessage(productsError), "error");
    }
  }, [productsError]);

  const handleApplyFilters = (filters: {
    categoryId?: number;
    season?: Season;
    brand?: string;
  }) => {
    setSelectedCategoryId(filters.categoryId);
    setSelectedSeason(filters.season);
    setSelectedBrand(filters.brand);
    setCurrentPage(1);
  };

  // =========================
  // SEARCH CHANGE
  // =========================

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  const handleShopCollection = () => {
    productsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  // =========================
  // LOADING
  // =========================

  // if (productsLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <SEO
        title="Men's & Women's Clothing Online in Pakistan"
        description="Shop men's and women's clothing online at Eshani, Pakistan. Discover stylish outfits, embroidered suits and seasonal collections with convenient delivery."
        path="/"
      />
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

            <button type="button" onClick={handleShopCollection}>
              {" "}
              Shop Collection{" "}
            </button>
          </div>
        </section>

        <section
          className="highlights-strip"
          aria-label="Eshani collections and shopping highlights"
        >
          <div className="highlights-strip__track">
            {[0, 1].map((group) => (
              <div
                className="highlights-strip__group"
                key={group}
                aria-hidden={group === 1}
              >
                {HOME_HIGHLIGHTS.map((highlight, index) => (
                  <span
                    className="highlights-strip__item"
                    key={`${highlight}-${index}`}
                  >
                    {highlight}
                    <span className="highlights-strip__star">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="products-section" ref={productsSectionRef}>
          <div className="products-section__header">
            <div>
              <span>OUR COLLECTION</span>

              <h2>
                {searchTerm ? `Search: ${searchTerm}` : "Shop Our Products"}
              </h2>

              <p>
                {pagination?.total ?? 0}{" "}
                {pagination?.total === 1 ? "Product" : "Products"}
              </p>
            </div>

            <div className="products-section__filters">
              <ProductFilterDrawer
                filters={{
                  categoryId: selectedCategoryId,
                  season: selectedSeason,
                  brand: selectedBrand,
                }}
                products={products}
                onApply={handleApplyFilters}
              />
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
          {productsFetching && products.length === 0 ? (
            <div className="products-loading" aria-label="Loading products">
              <Loader />
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : productsError ? (
            <div className="no-products">
              <h3>Products unavailable</h3>
              <p>Please try again shortly.</p>
            </div>
          ) : (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        {/* Pagination */}
        {!productsFetching && products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </>
  );
};

export default Home;
