import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost } from "../api/services";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPost(id);
        setPost(data);
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <main className="post-detail-page">
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="post-detail-page">
        <div className="auth-error" style={{ textAlign: "center" }}>
          {error || "Post not found."}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link to="/" className="back-link">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="post-detail-page">
      <Link to="/" className="back-link">
        &larr; Back to Home
      </Link>
      
      <article className="post-detail-card">
        <header className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <span className="post-author">{post.author?.name || "Unknown"}</span>
            <span className="dot-separator">&middot;</span>
            <time className="post-date">{date}</time>
            {post.status === "draft" && (
              <>
                <span className="dot-separator">&middot;</span>
                <span className="post-draft-badge">Draft</span>
              </>
            )}
          </div>
          
          {post.categories_detail && post.categories_detail.length > 0 && (
            <div className="post-categories">
              {post.categories_detail.map((cat) => (
                <span key={cat.id} className="category-tag">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="post-content">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
