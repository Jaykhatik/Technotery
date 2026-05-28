import Link from "next/link";
import type { Comment, Post, User } from "../../../generated/prisma";
import prisma from "../../../lib/prisma";
import CommentForm from "./CommentForm";

type PostDetail = Post & {
  author: User | null;
  comments: Array<Comment & { author?: User | null }>;
};

async function getPost(id: string): Promise<PostDetail | null> {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true, comments: { include: { author: true }, orderBy: { createdAt: "desc" } } },
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
          </div>

          <header className="article-header">
            <p className="eyebrow">Post</p>
            <h1>{post.title}</h1>
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
                <li className="comment-item" key={comment.id}>
                  <p>{comment.body}</p>
                  <div className="post-meta">
                    <span className="author-row">
                      <span className="avatar">{getInitial(comment.author)}</span>
                      {getAuthorName(comment.author)}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  );
}
