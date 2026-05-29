"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CommentItemProps = {
  commentId: number;
  body: string;
  authorName: string;
  authorInitial: string;
  date: string;
};

export default function CommentItem({
  commentId,
  body,
  authorName,
  authorInitial,
  date,
}: CommentItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setIsDeleting(true);

    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });

    if (!res.ok) {
      setError("Could not delete. Try again.");
      setIsDeleting(false);
      setShowConfirm(false);
      return;
    }

    router.refresh();
  }

  return (
    <li className="comment-item">
      <p>{body}</p>
      {error && <p style={{ color: "var(--danger)", fontSize: "0.8rem", margin: "0 0 0.5rem" }}>{error}</p>}
      <div className="post-meta">
        <span className="author-row">
          <span className="avatar">{authorInitial}</span>
          {authorName}
        </span>
        <span>{date}</span>

        {/* Delete Controls */}
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: "800",
              padding: "0.15rem 0.4rem",
              borderRadius: "4px",
              transition: "color 150ms ease, background 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = "var(--danger)";
              (e.target as HTMLButtonElement).style.background = "var(--warn-soft)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color = "var(--muted)";
              (e.target as HTMLButtonElement).style.background = "none";
            }}
          >
            🗑 Delete
          </button>
        ) : (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.78rem",
            }}
          >
            <span style={{ color: "var(--danger)", fontWeight: "700" }}>Sure?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                background: "var(--danger)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "800",
                padding: "0.15rem 0.55rem",
                borderRadius: "4px",
                fontSize: "0.78rem",
              }}
            >
              {isDeleting ? "…" : "Yes"}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              style={{
                background: "var(--line)",
                border: "none",
                cursor: "pointer",
                fontWeight: "800",
                padding: "0.15rem 0.55rem",
                borderRadius: "4px",
                fontSize: "0.78rem",
              }}
            >
              No
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
