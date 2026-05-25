"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCardProps } from "@/types";
import { deleteUser } from "@/services/userService";
import { toast } from "react-hot-toast";

export default function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initials = user.userName
    ? user.userName.slice(0, 2).toUpperCase()
    : "US";

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(user.userId);
      toast.success(`User '${user.userName}' deleted successfully!`);
      setConfirmDelete(false);
      
      // Refresh the Next.js router cache to synchronize listing data
      router.refresh();
    } catch (err) {
      console.error(err);
      const error = err as { message?: string };
      const errMsg = error.message || "Failed to delete user profile.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="user-info">
        <div className="avatar">{initials}</div>
        <div className="user-details">
          <span className="user-name">{user.userName}</span>
          <span className="user-id">ID: #{user.userId}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", width: "100%" }}>
        {confirmDelete ? (
          <div style={{ display: "flex", width: "100%", gap: "0.5rem" }}>
            <button
              onClick={handleDelete}
              className="btn"
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#fff",
                border: "none",
                margin: 0,
                fontSize: "0.85rem",
                padding: "0.6rem 0.8rem"
              }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="btn btn-back"
              style={{ flex: 1, margin: 0, fontSize: "0.85rem", padding: "0.6rem 0.8rem" }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <Link href={`/users/${user.userId}`} className="btn" style={{ flex: 1, margin: 0, fontSize: "0.85rem", padding: "0.6rem 0.8rem" }}>
              View Details
            </Link>
            <button
              onClick={() => setConfirmDelete(true)}
              className="btn"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#fca5a5",
                padding: "0.6rem 0.8rem",
                borderRadius: "12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ef4444";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                e.currentTarget.style.color = "#fca5a5";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
              }}
              title="Delete User"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
