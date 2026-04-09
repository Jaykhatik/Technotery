import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Logo */}
        <h2 className="footer-logo">JH</h2>

        {/* Contact */}
        <p>123-456-7890</p>
        <p>info@email.com</p>

        {/* Social Icons */}
        <div className="social-icons">
          <FaFacebookF />
          <FaInstagram />
          <FaLinkedinIn />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom"></div>
    </footer>
  );
};

export default Footer;