
import React from "react";
import "./state.css";
import { FaUsers, FaLayerGroup, FaCalendarCheck, FaCreditCard } from "react-icons/fa";

function Stats() {
  return (
    <section className="stats">

      {/* Left Text */}
      <div className="stats-left">
        <h2>
          Helping a local <br />
          <span>business reinvent itself</span>
        </h2>
        <p>We reached here with our hard work and dedication</p>
      </div>

      <div className="stats-right">
        <div className="stat">
          <FaUsers className="icon" />
          <div className="stat-text">
            <h3>2,245,341</h3>
            <p>Members</p>
          </div>
        </div>

        <div className="stat">
          <FaLayerGroup className="icon" />
          <div className="stat-text">
            <h3>46,328</h3>
            <p>Clubs</p>
          </div>
        </div>

        <div className="stat">
          <FaCalendarCheck className="icon" />
          <div className="stat-text">
            <h3>828,867</h3>
            <p>Event Bookings</p>
          </div>
        </div>

        <div className="stat">
          <FaCreditCard className="icon" />
          <div className="stat-text">
            <h3>1,926,436</h3>
            <p>Payments</p>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Stats;