import React from "react";
import ProductCard from "./ProductCard";

function CartCard({ cart, userMap, productMap, removeFromCart, updateQuantity }) {
  const product = productMap[cart.productId];

  if (!product) return null;

  return (
    <div className="cart-card">
      <div className="cart-header">
        <h2>👤 {userMap[cart.userId] || "Guest User"}</h2>
          <button
          onClick={() => removeFromCart(cart.productId)}
        >
          Remove
        </button>
      </div>

      <div className="products-grid">
        <ProductCard
          key={cart.productId}
          product={product}
          quantity={cart.quantity}
            increase={() => updateQuantity(cart.productId, 1)}
          decrease={() => updateQuantity(cart.productId, -1)}
        />
      </div>
    </div>
  );
}

export default CartCard;