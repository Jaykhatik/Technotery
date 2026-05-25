import { useState } from "react";
import { portfolioData } from "../data/portfolio";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Home", "About", "Projects", "Services", "Contact"];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => onNavigate("home")}>
        <div className="logo-icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <polygon
              points="18,2 22,14 34,14 24,22 28,34 18,26 8,34 12,22 2,14 14,14"
              stroke="url(#navGrad)"
              strokeWidth="1.5"
              fill="none"
            />
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="36" y2="36">
                <stop offset="0%" stopColor="#00bfff" />
                <stop offset="100%" stopColor="#0040ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="logo-text">{portfolioData.initials}</span>
      </div>

      {/* Desktop Nav */}
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item}>
            <button
              className={`nav-link ${activeSection === item.toLowerCase() ? "active" : ""}`}
              onClick={() => onNavigate(item.toLowerCase())}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      {/* Telegram / Contact icon */}
      <div className="navbar-right">
        <a
          href={`mailto:${portfolioData.email}`}
          className="nav-icon-btn"
          aria-label="Send message"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </a>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item}
              className={`mobile-nav-link ${activeSection === item.toLowerCase() ? "active" : ""}`}
              onClick={() => {
                onNavigate(item.toLowerCase());
                setMenuOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
