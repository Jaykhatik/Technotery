import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Utils/Firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");

      // redirect to login page
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Logout failed ");
    }
  };

  return (
    <div className="app">
      <div className="navbar">
        <div className="logo">My Dashboard</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="welcome-card">
          <h2>Welcome, User 👋</h2>
          <p>You are logged in successfully.</p>
        </div>

        <div className="card-grid">
          <div className="dashboard-card">
            <h3>Total Users</h3>
            <p>120</p>
          </div>

          <div className="dashboard-card">
            <h3>Orders</h3>
            <p>45</p>
          </div>

          <div className="dashboard-card">
            <h3>Revenue</h3>
            <p>₹25,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
