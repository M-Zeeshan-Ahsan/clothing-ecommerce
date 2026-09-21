import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Brand */}
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            LIBAAS
          </a>

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

          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/categories">Categories</a>
          <a href="/new-arrivals">New Arrivals</a>
          <a href="/sale">Sale</a>
        </div>

        {/* Customer Care */}
        <div className="footer__column">
          <h3>Customer Care</h3>

          <a href="/contact">Contact Us</a>
          <a href="/shipping">Shipping & Delivery</a>
          <a href="/returns">Returns & Exchange</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
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
