import React, { useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";
import Button from "../Buttons/Button";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <span className="logo-icon">▲</span>
        Nexcent
      </div>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/service">Service</NavLink></li>
        <li><NavLink to="/feature">Feature</NavLink></li>
        <li><NavLink to="/product">Product</NavLink></li>
        <li><NavLink to="/testimonial">Testimonial</NavLink></li>
        <li><NavLink to="/faq">FAQ</NavLink></li>
      </ul>

      {/* Auth Buttons */}
      <div className="auth-buttons">
        <button className="login-btn">Login</button>
        {/* <button className="signup-btn">Sign up</button> */}
        <Button className="signup-btn" text="Sign up"/>
      </div>
    </nav>
  );
}

export default Navbar;