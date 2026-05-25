"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { createUser, getAllUsers } from "@/services/userService";
import { toast } from "react-hot-toast";

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const responseData = await getAllUsers();
        const users = responseData.data;
        if (users && users.length > 0) {
          const ids = users.map((u) => Number(u.userId)).filter((id) => !isNaN(id));
          const maxId = ids.length > 0 ? Math.max(...ids) : 0;
          setUserId((maxId + 1).toString());
        } else {
          setUserId("1");
        }
      } catch (err) {
        console.error("Failed to load next user ID:", err);
        setUserId("1");
      }
    };
    fetchNextId();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const resolvedUserId = Number(userId);
    const userName = formData.get("userName") as string;
    const email = formData.get("email") as string;
    const age = Number(formData.get("age"));
    const city = formData.get("city") as string;

    try {
      await createUser({
        userId: resolvedUserId,
        userName,
        email,
        age,
        city,
      });

      toast.success("User profile created successfully!");
      // Redirect back to users directory on success
      router.push("/users");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || "Failed to create user. Make sure API is running.";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div style={{ color: "#fca5a5", textAlign: "center", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="userId">User ID (Auto-generated)</label>
            <input
              className="form-input"
              type="number"
              id="userId"
              name="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Calculating ID..."
              required
              disabled={loading}
              readOnly
              style={{ opacity: 0.7, cursor: "not-allowed" }}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? "Creating Profile..." : "Create User Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
