"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserDetailCardProps } from "@/types";
import { updateUser } from "@/services/userService";
import { toast } from "react-hot-toast";

export default function UserDetailCard({ initialUser }: UserDetailCardProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age.toString());
  const [city, setCity] = useState(user.city);

  const initials = user.userName
    ? user.userName.slice(0, 2).toUpperCase()
    : "US";

  const handleCancel = () => {
    // Reset form states to current user values
    setUserName(user.userName);
    setEmail(user.email);
    setAge(user.age.toString());
    setCity(user.city);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validations
    if (!userName.trim()) {
      toast.error("User Name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      toast.error("Age must be a valid positive number");
      return;
    }
    if (!city.trim()) {
      toast.error("City is required");
      return;
    }

    setLoading(true);

    try {
      const response = await updateUser(user.userId, {
        userName: userName.trim(),
        email: email.trim(),
        age: parsedAge,
        city: city.trim(),
      });

      const updatedUser = response.data as User;
      
      // Update local state for instant rendering
      setUser(updatedUser);
      toast.success("User profile updated successfully!");
      setIsEditing(false);
      
      // Refresh the Next.js router cache to keep server components synchronized
      router.refresh();
    } catch (err) {
      console.error(err);
      const error = err as { message?: string };
      const errMsg = error.message || "Failed to update user profile.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="detail-card edit-card-mode">
        <div className="profile-section" style={{ borderBottom: "none", paddingBottom: 0 }}>
          <div className="avatar-large">{initials}</div>
          <div className="user-details">
            <span className="user-name" style={{ fontSize: "1.5rem" }}>Editing Profile</span>
            <span className="user-id">Profile ID: #{user.userId}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="userName">User Name</label>
            <input
              className="form-input"
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g., John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              className="form-input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., john@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                className="form-input"
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 28"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <input
                className="form-input"
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., New York"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="card-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn-back"
              style={{ margin: 0 }}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ margin: 0 }}
              disabled={loading}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <div className="profile-section">
        <div className="avatar-large">{initials}</div>
        <div className="user-details">
          <span className="user-name">{user.userName}</span>
          <span className="user-id">Profile ID: #{user.userId}</span>
        </div>
      </div>

      <div className="info-grid">
        <div className="meta-item">
          <span className="meta-label">Email Address</span>
          <span className="meta-value">{user.email}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Age</span>
          <span className="meta-value">{user.age} years old</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Current City</span>
          <span className="meta-value">{user.city}</span>
        </div>
      </div>

      <div className="card-actions" style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ margin: 0, padding: "0.6rem 1.5rem" }}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
