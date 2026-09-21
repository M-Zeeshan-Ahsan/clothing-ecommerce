import { useState } from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/store";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          LIBAAS
        </Link>

        {/* Desktop Navigation */}
        <nav className={`header__nav ${menuOpen ? "active" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/sale">Sale</Link>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Search Button */}
          <button
            className="header__action"
            onClick={handleSearchToggle}
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>

          {/* Account */}
          <button className="header__action" aria-label="Account">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
          </button>

          {/* Wishlist */}
          <button className="header__action" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 8.6c0 5.5-8.8 10.4-8.8 10.4S3.2 14.1 3.2 8.6C3.2 5.5 5.3 3.5 8 3.5c1.7 0 3.2.8 4 2.1.8-1.3 2.3-2.1 4-2.1 2.7 0 4.8 2 4.8 5.1Z" />
            </svg>
          </button>

          {/* Cart */}
          <button className="header__action header__cart" aria-label="Cart">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 11h10.9L21 7H6" />
              <circle cx="9" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>

            {cartCount > 0 && (
              <span className="header__cart-count">{cartCount}</span>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            className="header__menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Navbar Search Bar */}
      <div className={`header__search ${searchOpen ? "active" : ""}`}>
        <div className="header__search-inner">
          {/* Search Icon */}
          <svg
            className="header__search-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={searchOpen}
          />

          {/* Clear Search */}
          {searchTerm && (
            <button
              className="header__search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          {/* Close Search */}
          <button
            className="header__search-close"
            onClick={handleSearchClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
