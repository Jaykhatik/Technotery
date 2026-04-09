import React, { useContext, useState } from "react";
import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import { CartContext } from "../../Contexts/CartContext";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import Logo from '../../Assets/Images/Logo_Image.png'

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="top-bar">
        <marquee>
          Welcome To JH Store!!!!!
        </marquee>

      </div>

      <header className="navbar">
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src={Logo} alt="Technotery" />
          </div>
        </Link>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav Links */}
        <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/product">Product</NavLink>
          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
        <div className="header-icons">
          <button className="icon-btn wishlist-icon" title="Wishlist">
            <FaHeart size={20} />
            {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
          </button>
          <button className="icon-btn cart-icon" title="Shopping Cart" onClick={() => navigate("/cart")}>
            <FaShoppingCart size={20} />
            {getTotalItems() > 0 && <span className="icon-badge">{getTotalItems()}</span>}
          </button>
          <button className="icon-btn profile-icon" title="Profile">
            <FaUser size={20} />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;