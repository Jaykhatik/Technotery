import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to MyApp</h1>
          <p className="hero-subtitle">
            Experience modern design with powerful functionality
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Explore Products
            </Link>
            <Link to="/user" className="btn btn-secondary">
              View Users
            </Link>
          </div>
        </div>
        <div className="hero-background">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>500+</h3>
          <p>Products Available</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <h3>10K+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h3>4.9/5</h3>
          <p>Average Rating</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <h3>24/7</h3>
          <p>Customer Support</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Why Choose Us?</h2>
          <p>Cutting-edge features designed for your success</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Modern Design</h3>
            <p>Beautiful and intuitive interface that makes every interaction smooth and enjoyable</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Optimized performance ensures your experience is always quick and responsive</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Enterprise-grade security keeps your data protected with advanced encryption</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Fully Responsive</h3>
            <p>Works perfectly on all devices - desktop, tablet, and mobile phones</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Global Reach</h3>
            <p>Access your data anywhere, anytime with our cloud-based solution</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Professional Tools</h3>
            <p>Powerful features to manage your business effectively and efficiently</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="process-header">
          <h2>How It Works</h2>
          <p>Simple steps to get you started</p>
        </div>
        <div className="process-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account in just 2 minutes with our simple registration</p>
            <div className="step-icon">✎</div>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Browse Products</h3>
            <p>Explore our extensive catalog with advanced search and filters</p>
            <div className="step-icon">🔍</div>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Make Purchase</h3>
            <p>Complete your transaction securely with multiple payment options</p>
            <div className="step-icon">💳</div>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Enjoy Service</h3>
            <p>Get instant access and enjoy our premium features</p>
            <div className="step-icon">🎉</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="pricing-header">
          <h2>Choose Your Plan</h2>
          <p>Flexible pricing that scales with your needs</p>
        </div>
        <div className="pricing-cards">
          <div className="price-card">
            <div className="price-badge">Starter</div>
            <h3>Free</h3>
            <p className="price-description">Perfect for trying us out</p>
            <ul className="features-list">
              <li>✓ 10 Products</li>
              <li>✓ Basic Support</li>
              <li>✓ Community Access</li>
            </ul>
            <button className="btn btn-outline">Get Started</button>
          </div>
          <div className="price-card featured">
            <div className="price-badge featured-badge">Popular</div>
            <h3>$29/mo</h3>
            <p className="price-description">Best for most businesses</p>
            <ul className="features-list">
              <li>✓ Unlimited Products</li>
              <li>✓ Priority Support</li>
              <li>✓ Advanced Analytics</li>
              <li>✓ Custom Branding</li>
            </ul>
            <button className="btn btn-primary">Start Free Trial</button>
          </div>
          <div className="price-card">
            <div className="price-badge">Enterprise</div>
            <h3>Custom</h3>
            <p className="price-description">For large organizations</p>
            <ul className="features-list">
              <li>✓ Everything in Pro</li>
              <li>✓ 24/7 Dedicated Support</li>
              <li>✓ Custom Integration</li>
              <li>✓ SLA Guarantee</li>
            </ul>
            <button className="btn btn-outline">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">SJ</div>
              <div className="testimonial-info">
                <p className="author">Sarah Johnson</p>
                <p className="role">CEO, Tech Startup</p>
              </div>
            </div>
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Amazing platform! The user experience is incredible and support team is very helpful."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">MC</div>
              <div className="testimonial-info">
                <p className="author">Mike Chen</p>
                <p className="role">Founder, E-commerce</p>
              </div>
            </div>
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Best investment for our business. The features are exactly what we needed."</p>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">ED</div>
              <div className="testimonial-info">
                <p className="author">Emily Davis</p>
                <p className="role">Product Manager</p>
              </div>
            </div>
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p>"Smooth interface with powerful functionality. Highly recommended!"</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions</p>
        </div>
        <div className="faq-container">
          <div className="faq-item">
            <div 
              className="faq-question"
              onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
            >
              <h3>What payment methods do you accept?</h3>
              <span className={`faq-icon ${expandedFaq === 0 ? "open" : ""}`}>+</span>
            </div>
            {expandedFaq === 0 && (
              <div className="faq-answer">
                <p>We accept all major credit cards, PayPal, and bank transfers for your convenience.</p>
              </div>
            )}
          </div>

          <div className="faq-item">
            <div 
              className="faq-question"
              onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
            >
              <h3>Can I cancel my subscription anytime?</h3>
              <span className={`faq-icon ${expandedFaq === 1 ? "open" : ""}`}>+</span>
            </div>
            {expandedFaq === 1 && (
              <div className="faq-answer">
                <p>Yes! You can cancel your subscription anytime without any hidden charges or penalties.</p>
              </div>
            )}
          </div>

          <div className="faq-item">
            <div 
              className="faq-question"
              onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
            >
              <h3>Is my data secure?</h3>
              <span className={`faq-icon ${expandedFaq === 2 ? "open" : ""}`}>+</span>
            </div>
            {expandedFaq === 2 && (
              <div className="faq-answer">
                <p>We use enterprise-grade encryption and comply with all international security standards.</p>
              </div>
            )}
          </div>

          <div className="faq-item">
            <div 
              className="faq-question"
              onClick={() => setExpandedFaq(expandedFaq === 3 ? null : 3)}
            >
              <h3>Do you offer customer support?</h3>
              <span className={`faq-icon ${expandedFaq === 3 ? "open" : ""}`}>+</span>
            </div>
            {expandedFaq === 3 && (
              <div className="faq-answer">
                <p>Yes, we provide 24/7 customer support via email, chat, and phone for all plans.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Get the latest news and updates delivered to your inbox</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email..." />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust our platform</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn btn-primary-large">
              Browse Products Now
            </Link>
            <a href="#contact" className="btn btn-outline">
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
