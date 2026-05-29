import React from "react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import TagForm from "./TagForm";

export const dynamic = "force-dynamic";

async function getTagsData() {
  const [tags, posts] = await Promise.all([
    prisma.tag.findMany({
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    }),
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return { tags, posts };
}

export default async function TagsPage() {
  const { tags, posts } = await getTagsData();

  return (
    <main className="page">
      <header className="page-header" style={{ alignItems: "center" }}>
        <div>
          <p className="eyebrow">Taxonomy</p>
          <h1 style={{ margin: 0 }}>Tags</h1>
          <p className="lede" style={{ marginTop: "0.5rem" }}>
            Manage the classification of your posts using relational database tags.
          </p>
        </div>
      </header>

      <div className="detail-layout" style={{ marginTop: "1.5rem" }}>
        {/* Left Column: Tags List */}
        <section className="detail-panel" style={{ padding: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: "600" }}>
            Active Tags ({tags.length})
          </h2>

          {tags.length === 0 ? (
            <div className="comment-empty" style={{ margin: 0, padding: "3rem" }}>
              <h3>No tags created yet</h3>
              <p>Create your first relational tag using the form on the right.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    border: "1px solid var(--line, #d6dce6)",
                    borderRadius: "8px",
                    padding: "1rem",
                    background: "var(--surface-raised, #fbfcfe)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                  }}
                  className="tag-card-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        background: "var(--accent-soft, #d9f5ef)",
                        color: "var(--accent-strong, #0b5f59)",
                        fontWeight: "800",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                      }}
                    >
                      #{tag.name}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>ID: {tag.id}</span>
                  </div>

                  <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                    {tag.post ? (
                      <span style={{ color: "var(--muted)" }}>
                        Linked to:{" "}
                        <Link
                          href={`/posts/${tag.post.id}`}
                          style={{
                            color: "var(--blue, #255e9c)",
                            fontWeight: "700",
                            textDecoration: "underline",
                          }}
                        >
                          {tag.post.title}
                        </Link>
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted)", fontStyle: "italic" }}>Not linked to any post</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Create Tag Form */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TagForm posts={posts} />
        </aside>
      </div>
    </main>
  );
}
