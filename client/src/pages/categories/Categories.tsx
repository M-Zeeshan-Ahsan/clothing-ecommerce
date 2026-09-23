import { Link } from "react-router-dom";

import { useGetCategoriesQuery } from "../../store/api/categoryApi";
import Loader from "../../components/common/loader/Loader";

import "./Categories.scss";

const categoryImages: Record<string, string> = {
  men: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85",

  women:
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85",
};

const categoryDescriptions: Record<string, string> = {
  men: "Classic looks for modern men.",

  women: "Elegant styles designed for every occasion.",
};

const defaultImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85";

const Categories = () => {
  const { data, isLoading, error } = useGetCategoriesQuery();

  const categories = data?.data ?? [];

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <main className="categories">
        <section className="categories__content">
          <div className="categories__heading">
            <h2>Unable to load categories</h2>
            <p>Please try again later.</p>
          </div>
        </section>
      </main>
    );
  }

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
          {categories.map((category) => {
            const categoryKey = category.category_name.toLowerCase();

            const image = categoryImages[categoryKey] ?? defaultImage;

            const description =
              categoryDescriptions[categoryKey] ??
              `Explore our ${category.category_name} collection.`;

            return (
              <Link
                key={category.id}
                to={`/shop?categoryId=${category.id}`}
                className="categories__card"
              >
                <div className="categories__image-wrapper">
                  <img
                    src={image}
                    alt={category.category_name}
                    className="categories__image"
                  />

                  <div className="categories__overlay" />
                </div>

                <div className="categories__card-content">
                  <span>COLLECTION</span>

                  <h3>{category.category_name}</h3>

                  <p>{description}</p>

                  <span className="categories__link">Shop Collection →</span>
                </div>
              </Link>
            );
          })}
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
