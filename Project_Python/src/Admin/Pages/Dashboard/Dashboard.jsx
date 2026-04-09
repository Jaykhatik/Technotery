import React from 'react'
import './Dashboard.css'

function AdminDashboard() {
  
  return (
    <div className="dashboard">

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">R$ 45,230</p>
            <span className="stat-change">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">342</p>
            <span className="stat-change">+8 new this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">28</p>
            <span className="stat-change">5 urgent</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <p className="stat-value">1,256</p>
            <span className="stat-change">+45 this month</span>
          </div>
        </div>
      </div>

      {/* ===== RECENT ORDERS ===== */}
      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-001</td>
              <td>John Doe</td>
              <td>Vaso de Cerâmica</td>
              <td>R$ 70,00</td>
              <td><span className="badge pending">Pending</span></td>
              <td>2025-04-06</td>
            </tr>
            <tr>
              <td>#ORD-002</td>
              <td>Jane Smith</td>
              <td>Home Decor Set</td>
              <td>R$ 150,00</td>
              <td><span className="badge completed">Completed</span></td>
              <td>2025-04-05</td>
            </tr>
            <tr>
              <td>#ORD-003</td>
              <td>Mike Wilson</td>
              <td>Wall Art</td>
              <td>R$ 89,00</td>
              <td><span className="badge shipping">Shipping</span></td>
              <td>2025-04-04</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard