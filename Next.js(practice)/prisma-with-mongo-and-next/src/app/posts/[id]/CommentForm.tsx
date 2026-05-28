"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CommentFormProps = {
  postId: string;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body, authorName, authorEmail }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Could not add comment");
      setIsSubmitting(false);
      return;
    }

    setBody("");
    setAuthorName("");
    setAuthorEmail("");
    setIsSubmitting(false);
    setIsOpen(false);
    router.refresh();
  }

  function closeModal() {
    if (isSubmitting) return;
    setError("");
    setIsOpen(false);
  }

  return (
    <>
      <button className="button primary" type="button" onClick={() => setIsOpen(true)}>
        Add comment
      </button>

      {isOpen ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeModal}>
          <div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="commentModalTitle"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Comment</p>
                <h2 id="commentModalTitle">Add comment</h2>
              </div>
              <button className="button" type="button" onClick={closeModal} disabled={isSubmitting}>
                Close
              </button>
            </div>

            <form className="comment-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="commentAuthorName">Name</label>
                  <input id="commentAuthorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                </div>

                <div className="field">
                  <label htmlFor="commentAuthorEmail">Email</label>
                  <input
                    id="commentAuthorEmail"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                  />
                </div>

                <div className="field full">
                  <label htmlFor="commentBody">Comment</label>
                  <textarea id="commentBody" value={body} onChange={(e) => setBody(e.target.value)} required />
                </div>
              </div>

              <div className="form-footer">
                {error ? <p className="form-error">{error}</p> : <span />}
                <button className="button primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post comment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
