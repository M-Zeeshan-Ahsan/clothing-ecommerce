import ProductCard from "../../components/product/ProductCard";
import { products } from "../../data/products";
import "./Home.scss";

const Home = () => {
  const categories = ["All", "Women", "Men", "Lawn", "Boski", "Cotton"];

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
            <h2>Shop Our Products</h2>
          </div>

          <div className="category-filter">
            {categories.map((category) => (
              <button key={category}>{category}</button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
