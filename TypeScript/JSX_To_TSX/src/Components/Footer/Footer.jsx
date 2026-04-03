import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* Top Section */}
      <div className="footer-container">

        {/* About */}
        <div className="footer-section">
          <h2 className="footer-logo">MyApp</h2>
          <p>
            We create modern and responsive web applications with beautiful UI
            and great user experience.
          </p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h3>Company</h3>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <a href="#">Help Center</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">FAQ</a>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get latest updates</p>

          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>

          <div className="socials">
            <span>🌐</span>
            <span>📘</span>
            <span>🐦</span>
            <span>📸</span>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 MyApp. All rights reserved.</p>

        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>

    </footer>
  );
}

export default Footer;