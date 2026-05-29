import Link from "next/link";
import type { Comment, Post, User, Tag } from "@prisma/client";
import prisma from "../../../lib/prisma";
import CommentForm from "./CommentForm";
import PostActions from "./PostActions";
import CommentItem from "./CommentItem";

type PostDetail = Post & {
  author: User | null;
  comments: Array<Comment & { author?: User | null }>;
  tags: Tag[];
};

async function getPost(id: string): Promise<PostDetail | null> {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return null;

  return prisma.post.findUnique({
    where: { id: parsedId },
    include: {
      author: true,
      comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
      tags: true,
    },
  });
}

function getAuthorName(author: User | null | undefined) {
  return author?.name || author?.email || "Unknown";
}

function getInitial(author: User | null | undefined) {
  return getAuthorName(author).charAt(0).toUpperCase();
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <main className="page">
        <section className="empty-state">
          <h1>Post not found</h1>
          <Link href="/posts" className="button primary">
            Back to posts
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="detail-layout">
        <article className="detail-panel post-article">
          <div className="article-toolbar">
            <Link href="/posts" className="button">
              Back
            </Link>
            <span className={post.published ? "status published" : "status draft"}>
              {post.published ? "Published" : "Draft"}
            </span>
            <PostActions
              postId={post.id}
              initialTitle={post.title}
              initialContent={post.content}
              initialPublished={post.published}
            />
          </div>

          <header className="article-header">
            <p className="eyebrow">Post</p>
            <h1>{post.title}</h1>
            {post.tags && post.tags.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    style={{
                      background: "var(--accent-soft, #d9f5ef)",
                      color: "var(--accent-strong, #0b5f59)",
                      fontWeight: "800",
                      padding: "0.2rem 0.65rem",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                    }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="article-byline">
              <span className="author-row">
                <span className="avatar large">{getInitial(post.author)}</span>
                <span>
                  <strong>{getAuthorName(post.author)}</strong>
                  <small>{formatDate(post.createdAt)}</small>
                </span>
              </span>
            </div>
          </header>

          <div className="post-body">{post.content || "No content yet."}</div>
        </article>

        <aside className="comments-panel">
          <div className="comments-panel-header">
            <div>
              <h2>Comments</h2>
              <p className="lede">
                {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"} on this post
              </p>
            </div>
            <CommentForm postId={post.id} />
          </div>
          {post.comments.length === 0 ? (
            <div className="comment-empty">
              <h3>No comments yet</h3>
              <p>Start the discussion for this post.</p>
            </div>
          ) : (
            <ul className="comments-list">
              {post.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  commentId={comment.id}
                  body={comment.body}
                  authorName={getAuthorName(comment.author)}
                  authorInitial={getInitial(comment.author)}
                  date={formatDate(comment.createdAt)}
                />
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  );
}
