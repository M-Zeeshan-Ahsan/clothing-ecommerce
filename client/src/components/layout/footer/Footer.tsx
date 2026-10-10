import "./Footer.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSubscribeNewsletterMutation } from "../../../store/api/newsletterApi";
import { showToast } from "../../../utils/toast";
interface FooterProps {
  className?: string;
}
const Footer = ({ className = "" }: FooterProps) => {
  const [email, setEmail] = useState("");

  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email", "error");
      return;
    }

    try {
      const response = await subscribeNewsletter({
        email: email.trim(),
      }).unwrap();

      showToast(response.message, "success");
      setEmail("");
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (
              error as {
                data?: {
                  message?: string;
                };
              }
            ).data?.message
          : "Something went wrong";

      showToast(message || "Something went wrong", "error");
    }
  };
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            ESHANI
          </Link>

          <p>
            Timeless fashion crafted for modern elegance. Discover premium
            clothing designed for everyday confidence.
          </p>

          <div className="footer__socials">
            {/* <a href="#" aria-label="Instagram">
              Instagram
            </a> */}

            <a
              href="https://www.facebook.com/share/1TpMysw6Ag/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>

            <a
              href="https://www.tiktok.com/@eshanishop?is_from_webapp=1&sender_device=pc"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
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

          <form className="footer__form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className={`footer__bottom ${className}`}>
        <p>© 2026 ESHANI. All rights reserved.</p>

        <p>Premium Fashion Store</p>
      </div>
    </footer>
  );
};

export default Footer;
