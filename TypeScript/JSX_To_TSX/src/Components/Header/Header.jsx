import React, { useState } from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">MyApp</div>

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
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <NavLink end to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Products</NavLink>
        <NavLink to="/user" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Users</NavLink>
        <NavLink to="/carts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Cart</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
      </nav>
    </header>
  );
}

export default Header;