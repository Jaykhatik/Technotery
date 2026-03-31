import React from "react";

function ProductCard({ product, quantity, increase, decrease }) {
  if (!product) return null;

  return (
    <div className="product-card">
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="price">💲 {product.price}</p>
        <p className="qty">
          <button onClick={increase} >
            +
          </button>
          Qty: {quantity}{" "}

          <button onClick={decrease} >-</button>
        </p>
      </div>
    </div>
  );
}

export default ProductCard;