import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            LIBAAS
          </Link>

          <p>
            Timeless fashion crafted for modern elegance. Discover premium
            clothing designed for everyday confidence.
          </p>

          <div className="footer__socials">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <a href="#" aria-label="TikTok">
              TikTok
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer__column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/sale">Sale</Link>
        </div>

        {/* Customer Care */}
        <div className="footer__column">
          <h3>Customer Care</h3>

          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping">Shipping & Delivery</Link>
          <Link to="/returns">Returns & Exchange</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        {/* Newsletter */}
        <div className="footer__newsletter">
          <h3>Stay In Style</h3>

          <p>
            Subscribe to get updates about new collections, exclusive offers and
            more.
          </p>

          <form className="footer__form">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
            />

            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer__bottom">
        <p>© 2026 LIBAAS. All rights reserved.</p>

        <p>Premium Fashion Store</p>
      </div>
    </footer>
  );
};

export default Footer;
