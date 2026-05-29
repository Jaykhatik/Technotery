"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type PostOption = {
  id: number;
  title: string;
};

type TagFormProps = {
  posts: PostOption[];
};

export default function TagForm({ posts }: TagFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [postId, setPostId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        postId: postId || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Could not create tag");
      setIsSubmitting(false);
      return;
    }

    setName("");
    setPostId("");
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "600" }}>Add New Tag</h2>
      
      <div className="form-grid">
        <div className="field">
          <label htmlFor="tagName">Tag Name</label>
          <input
            id="tagName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. tech, lifestyle, nature"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="field">
          <label htmlFor="tagPost">Link to Post (Optional)</label>
          <select
            id="tagPost"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md, 8px)",
              border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "var(--text-color, #fff)",
              outline: "none",
            }}
          >
            <option value="">-- None (Just create tag) --</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title} (ID: {post.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-footer" style={{ marginTop: "1.5rem" }}>
        {error ? <p className="form-error" style={{ margin: 0 }}>{error}</p> : <span />}
        <button className="button primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Tag"}
        </button>
      </div>
    </form>
  );
}
