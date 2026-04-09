import React, { useContext } from "react";
import { CartContext } from "../../Contexts/CartContext";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } =
    useContext(CartContext);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  // ✅ CHECKOUT HANDLER
  const handleCheckout = () => {
    if (!user) {
      // 🔥 redirect to login if not logged in
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      // ✅ go to checkout page
      navigate("/checkout");
    }
  };

  // ✅ EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h1>Your Cart is Empty</h1>
          <p>Add some products to your cart and come back!</p>
          <button
            className="continue-shopping"
            onClick={() => navigate("/product")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-content">
        {/* CART ITEMS */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              
              <img
              src={`http://192.168.0.3:8000${item.image}`}
                alt={item.name}
                className="item-image"
              />

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price.toFixed(2)}</p>
              </div>

              {/* QUANTITY */}
              <div className="item-quantity">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              {/* ITEM TOTAL */}
              <div className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>

              {/* REMOVE */}
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                title="Remove from cart"
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>

          <div className="summary-row discount">
            <span>Discount (10%):</span>
            <span>-₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{(getTotalPrice() * 0.9).toFixed(2)}</span>
          </div>

          {/* ✅ CHECKOUT BUTTON */}
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <button
            className="continue-btn"
            onClick={() => navigate("/product")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;