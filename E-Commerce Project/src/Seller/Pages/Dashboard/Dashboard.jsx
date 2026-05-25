import React from "react";

function SellerDashboard() {
  return (
    <div>
      <h2>Seller Dashboard</h2>
      <p>Welcome Seller 👋</p>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <div style={cardStyle}>
          <h4>Total Products</h4>
          <p>12</p>
        </div>

        <div style={cardStyle}>
          <h4>Total Orders</h4>
          <p>8</p>
        </div>

        <div style={cardStyle}>
          <h4>Total Revenue</h4>
          <p>₹25,000</p>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  padding: "20px",
  borderRadius: "10px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

export default SellerDashboard;