import { Link } from "react-router-dom";

import "./Categories.scss";

const categories = [
  {
    id: 1,
    name: "Lawn",
    description: "Lightweight styles for every season.",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Boski",
    description: "Elegant and premium Boski collections.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Cotton",
    description: "Comfortable cotton styles for everyday wear.",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Men",
    description: "Classic looks for modern men.",
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Wash Wear",
    description: "Smart and effortless everyday fashion.",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
  },
];

const Categories = () => {
  return (
    <main className="categories">
      {/* Hero */}
      <section className="categories__hero">
        <div className="categories__hero-content">
          <span>EXPLORE LIBAAS</span>

          <h1>Categories</h1>

          <p>
            Discover our carefully selected collections designed for every style
            and occasion.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="categories__content">
        <div className="categories__heading">
          <span>SHOP BY CATEGORY</span>

          <h2>Find Your Style</h2>

          <p>
            Explore our collections and discover pieces that match your personal
            style.
          </p>
        </div>

        <div className="categories__grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="categories__card"
            >
              <div className="categories__image-wrapper">
                <img
                  src={category.image}
                  alt={category.name}
                  className="categories__image"
                />

                <div className="categories__overlay" />
              </div>

              <div className="categories__card-content">
                <span>COLLECTION</span>

                <h3>{category.name}</h3>

                <p>{category.description}</p>

                <span className="categories__link">Shop Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="categories__cta">
        <div className="categories__cta-content">
          <span>LIBAAS COLLECTION</span>

          <h2>
            Something for
            <br />
            Every Style
          </h2>

          <p>
            Browse our complete collection and find your next favorite piece.
          </p>

          <Link to="/shop" className="categories__cta-button">
            Shop All Products
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Categories;
