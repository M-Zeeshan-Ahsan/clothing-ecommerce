import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import "./Home.scss";
import { useOutletContext } from "react-router-dom";
import { useGetProductsQuery } from "../../store/api/productApi";
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
  const { searchTerm, setSearchTerm } = useOutletContext<SearchContext>();
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });
  const products = data?.data.products ?? [];
  const pagination = data?.data.pagination;

  const categories = ["All", "Women", "Men", "Lawn", "Boski", "Cotton"];

  useEffect(() => {
    if (error) {
      showToast(getApiErrorMessage(error), "error");
    }
  }, [error]);

  if (isLoading) {
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

          <div className="category-filter">
            {categories.map((category) => (
              <button key={category}>{category}</button>
            ))}
          </div>
        </div>

        {/* Home Search */}
        <div className="product-search">
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
      <Pagination
        currentPage={currentPage}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};

export default Home;
