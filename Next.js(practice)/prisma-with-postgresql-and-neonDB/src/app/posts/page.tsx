import Link from "next/link";
import type { Post, User, Tag } from "@prisma/client";
import prisma from "../../lib/prisma";

type PostListItem = Post & {
  author: User | null;
  comments: Array<{ id: number }>;
  tags: Tag[];
};

export const dynamic = "force-dynamic";

async function getPosts(): Promise<PostListItem[]> {
  return prisma.post.findMany({
    include: {
      author: true,
      comments: { select: { id: true } },
      tags: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

function getAuthorName(author: User | null) {
  return author?.name || author?.email || "Unknown";
}

function getInitial(author: User | null) {
  return getAuthorName(author).charAt(0).toUpperCase();
}

function getExcerpt(content: string | null) {
  if (!content) return "No content yet.";
  return content.length > 120 ? `${content.slice(0, 120)}...` : content;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function PostsPage() {
  const posts = await getPosts();
  const publishedCount = posts.filter((post) => post.published).length;
  const draftCount = posts.length - publishedCount;

  return (
    <main className="page">
      <header className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Workspace</p>
          <h1>Posts that actually feel alive.</h1>
          <p className="lede">Create, publish, and discuss posts from one clean MongoDB-backed Prisma interface.</p>
        </div>
        <Link href="/new-post" className="button primary">
          New post
        </Link>
        <div className="hero-stats" aria-label="Post stats">
          <div>
            <strong>{posts.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{publishedCount}</strong>
            <span>Published</span>
          </div>
          <div>
            <strong>{draftCount}</strong>
            <span>Drafts</span>
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <section className="empty-state">
          <h2>No posts yet</h2>
          <p className="lede">Create the first one when you are ready.</p>
        </section>
      ) : (
        <ul className="post-grid post-list-reset">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`} className="post-card">
                <div className="card-topline">
                  <span className={post.published ? "status published" : "status draft"}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="comment-count">{post.comments.length} comments</span>
                </div>
                <h2>{post.title}</h2>
                {post.tags && post.tags.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.85rem" }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        style={{
                          background: "var(--accent-soft, #d9f5ef)",
                          color: "var(--accent-strong, #0b5f59)",
                          fontWeight: "800",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                        }}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p>{getExcerpt(post.content)}</p>
                <div className="post-meta">
                  <span className="author-row">
                    <span className="avatar">{getInitial(post.author)}</span>
                    {getAuthorName(post.author)}
                  </span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
