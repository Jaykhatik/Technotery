import React, { useContext } from "react";
import { WishlistContext } from "../../../../Contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import "./Wishlist.css";
import { CartContext } from "../../../../Contexts/CartContext";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } =
    useContext(WishlistContext);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // ✅ EMPTY STATE
  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-container empty">
        <h1>Your Wishlist is Empty ❤️</h1>
        <p>Save your favorite items here</p>
        <button onClick={() => navigate("/product")}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
   <div className="wishlist-container">
  <h1 className="wishlist-title">
    {/* My Wishlist <span>❤️</span> */}
  </h1>

  <div className="wishlist-grid">
    {wishlistItems.map((item) => (
      <div className="wishlist-card" key={item.id}>
        
        <div className="wishlist-image-container">

          <img
            src={`http://192.168.0.3:8000${item.image}`}
            alt={item.name}
            className="wishlist-image"
          />

          <div className="wishlist-overlay"></div>

          {/* REMOVE */}
          <button
            className="wishlist-remove"
            onClick={() => removeFromWishlist(item.id)}
          >
            <FaTrash />
          </button>

          {/* NEW BADGE */}
          <span className="wishlist-badge">Saved</span>
        </div>

        <div className="wishlist-info">
          <h3>{item.name}</h3>

          <div className="wishlist-price">
            ₹{item.price}
          </div>

          <div className="wishlist-actions">
            <button
              className="wishlist-cart-btn"
              onClick={() => addToCart(item)}
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              className="wishlist-view-btn"
              onClick={() => navigate(`/product/${item.uuid}`)}
            >
              👁️ View
            </button>
          </div>
        </div>

      </div>
    ))}
  </div>
</div>
  );
}

export default Wishlist;