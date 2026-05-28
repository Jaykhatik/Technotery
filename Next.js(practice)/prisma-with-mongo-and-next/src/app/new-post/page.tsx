"use client";

import React, { useState } from "react";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, authorName, authorEmail, published }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error || "Could not create post");
      setIsSubmitting(false);
      return;
    }

    window.location.href = "/posts";
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Compose</p>
          <h1>New post</h1>
          <p className="lede">Write the post, choose the author, and decide whether it should publish now.</p>
        </div>
      </header>

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="title">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="authorName">Author name</label>
            <input id="authorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="authorEmail">Author email</label>
            <input
              id="authorEmail"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              required
            />
          </div>

          <div className="field full">
            <label htmlFor="content">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </div>

        <div className="form-footer">
          <label className="checkbox-field">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Publish now
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create post"}
          </button>
        </div>
      </form>
    </main>
  );
}
