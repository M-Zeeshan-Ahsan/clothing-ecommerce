import { useEffect } from "react";
import ProductCard from "../../components/product/ProductCard";
import "./Home.scss";
import { useOutletContext } from "react-router-dom";
import { useGetProductsQuery } from "../../store/api/productApi";
import Loader from "../../components/common/loader/Loader";
import { showToast } from "../../utils/toast";
import { getApiErrorMessage } from "../../utils/apiError";
interface SearchContext {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Home = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const products = data?.data.products ?? [];
  const pagination = data?.data.pagination;
  const { searchTerm, setSearchTerm } = useOutletContext<SearchContext>();
  const categories = ["All", "Women", "Men", "Lawn", "Boski", "Cotton"];

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
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
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
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
    </main>
  );
};

export default Home;
