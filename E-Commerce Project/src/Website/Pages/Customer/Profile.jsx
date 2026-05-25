import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import "./Profile.css";
import { getUserProfile } from "../../../Services/User/UserServices";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setUser(data);
    } catch (err) {
      console.error("Profile Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  // ❌ No user case
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Failed to load profile</h2>
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-container">

        {/* LEFT PANEL */}
        <div className="profile-left">
          <div className="profile-card">

            <div className="profile-avatar">
              <FaUserCircle />
            </div>

            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-role">({user.role})</p>

            <div className="profile-status">
              {user.is_active && (
                <span className="status active">
                  <FaCheckCircle /> Active
                </span>
              )}

              {user.is_verified && (
                <span className="status verified">
                  <FaShieldAlt /> Verified
                </span>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="profile-right">

          <div className="profile-header">
            <h1>Profile Overview</h1>
            <p>Manage your account information</p>
          </div>

          <div className="profile-details">

            <div className="detail-card">
              <FaUserCircle className="detail-icon" />
              <div>
                <span>Username</span>
                <h3>{user.username}</h3>
              </div>
            </div>

            <div className="detail-card">
              <FaEnvelope className="detail-icon" />
              <div>
                <span>Email</span>
                <h3>{user.email}</h3>
              </div>
            </div>

            <div className="detail-card">
              <FaPhone className="detail-icon" />
              <div>
                <span>Phone</span>
                <h3>{user.phone || "Not Added"}</h3>
              </div>
            </div>

            <div className="detail-card">
              <FaShieldAlt className="detail-icon" />
              <div>
                <span>Account Status</span>
                <h3>
                  {user.is_active ? "Active" : "Inactive"} &{" "}
                  {user.is_verified ? "Verified" : "Not Verified"}
                </h3>
              </div>
            </div>

          </div>

          {/* EXTRA CARD */}
          <div className="profile-extra">
            <h2>Account ID</h2>
            <p>{user.uuid}</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;