"use client"

import Link from "next/link";

export default function AddUserPage() {
  return (
    <div className="form-container">
      <Link href="/users" className="btn btn-back">
        ← Back to Directory
      </Link>

      <div className="form-card">
        <header className="form-header">
          <h1>Add New User</h1>
          <p>Create a new profile entry in the database</p>
        </header>

        <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="userId">User ID</label>
            <input
              className="form-input"
              type="number"
              id="userId"
              name="userId"
              placeholder="e.g., 5"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="userName">User Name</label>
            <input
              className="form-input"
              type="text"
              id="userName"
              name="userName"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              placeholder="e.g., john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input
              className="form-input"
              type="number"
              id="age"
              name="age"
              placeholder="e.g., 28"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="city">City</label>
            <input
              className="form-input"
              type="text"
              id="city"
              name="city"
              placeholder="e.g., New York"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-submit">
              Create User Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
