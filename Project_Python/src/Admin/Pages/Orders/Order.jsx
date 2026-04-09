import React from "react";
import "./Order.css";

const Orders = () => {
  return (
    <div className="orders-container">
      <h2>📦 Orders Management</h2>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Dummy Row 1 */}
            <tr>
              <td>#ORD001</td>
              <td>Jay Patel</td>
              <td>
                <div>iPhone 15 (x1)</div>
                <div>AirPods (x2)</div>
              </td>
              <td>₹120000</td>
              <td><span className="status pending">Pending</span></td>
              <td>09 Apr 2026</td>
              <td>
                <button className="btn view">View</button>
              </td>
            </tr>


          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;