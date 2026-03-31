import React from "react";
import "./footer.css";
import { FaGlobe, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <h2 className="logo">Nexcent</h2>
          <p>Copyright © 2020 Nexcent ltd.</p>
          <p>All rights reserved</p>

          <div className="social-icons">
            <FaGlobe />
            <FaInstagram />
            <FaTwitter />
            <FaYoutube />
          </div>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h4>Company</h4>
          <a href="#">About us</a>
          <a href="#">Blog</a>
          <a href="#">Contact us</a>
          <a href="#">Pricing</a>
          <a href="#">Testimonials</a>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h4>Support</h4>
          <a href="#">Help center</a>
          <a href="#">Terms of service</a>
          <a href="#">Legal</a>
          <a href="#">Privacy policy</a>
          <a href="#">Status</a>
        </div>

        {/* Subscribe */}
        <div className="footer-column">
          <h4>Stay up to date</h4>
          <div className="subscribe-box">
            <input type="email" placeholder="Your email address" />
            <button>
              <FaPaperPlane />
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
}

export default Footer;