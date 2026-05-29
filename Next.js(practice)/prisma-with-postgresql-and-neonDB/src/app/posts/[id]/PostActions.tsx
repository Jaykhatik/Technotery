"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PostActionsProps = {
  postId: number;
  initialTitle: string;
  initialContent: string | null;
  initialPublished: boolean;
};

export default function PostActions({
  postId,
  initialTitle,
  initialContent,
  initialPublished,
}: PostActionsProps) {
  const router = useRouter();

  // ── Edit modal state ──────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent ?? "");
  const [published, setPublished] = useState(initialPublished);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Delete state ──────────────────────────────────────────
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ── Handlers ──────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setIsSaving(true);

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: content || null, published }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setSaveError(data?.error || "Could not update post");
      setIsSaving(false);
      return;
    }

    setIsEditOpen(false);
    setIsSaving(false);
    router.refresh();
  }

  async function handleDelete() {
    setDeleteError("");
    setIsDeleting(true);

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

    if (!res.ok) {
      setDeleteError("Could not delete post. Please try again.");
      setIsDeleting(false);
      return;
    }

    router.push("/posts");
  }

  return (
    <>
      {/* ── Toolbar buttons ── */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          className="button"
          type="button"
          onClick={() => setIsEditOpen(true)}
          title="Edit this post"
        >
          ✏️ Edit
        </button>
        <button
          className="button"
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          title="Delete this post"
          style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
        >
          🗑 Delete
        </button>
      </div>

      {/* ── Edit Modal ── */}
      {isEditOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => { if (!isSaving) setIsEditOpen(false); }}
        >
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editPostTitle"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Edit</p>
                <h2 id="editPostTitle">Update post</h2>
              </div>
              <button
                className="button"
                type="button"
                onClick={() => setIsEditOpen(false)}
                disabled={isSaving}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="editTitle">Title</label>
                  <input
                    id="editTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="editContent">Content</label>
                  <textarea
                    id="editContent"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSaving}
                    style={{ minHeight: "180px" }}
                  />
                </div>
              </div>

              <div className="form-footer">
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    disabled={isSaving}
                  />
                  Published
                </label>
                {saveError && <p className="form-error">{saveError}</p>}
                <button className="button primary" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {isDeleteOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => { if (!isDeleting) setIsDeleteOpen(false); }}
        >
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deletePostTitle"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px" }}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow" style={{ color: "var(--danger)" }}>Danger zone</p>
                <h2 id="deletePostTitle">Delete this post?</h2>
              </div>
            </div>

            <p style={{ color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              This will permanently delete the post and all its comments. This action
              cannot be undone.
            </p>

            {deleteError && (
              <p className="form-error" style={{ marginBottom: "1rem" }}>{deleteError}</p>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                className="button"
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="button primary"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ background: "var(--danger)", borderColor: "var(--danger)" }}
              >
                {isDeleting ? "Deleting…" : "Yes, delete post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
