import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost } from "../api/services";
import { useAuth } from "../context/AuthContext";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPost(id)
      .then(({ data }) => setPost(data))
      .catch(() => setError("Post not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="post-detail-page"><div className="spinner" /></main>;
  if (error || !post) return <main className="post-detail-page"><div className="auth-error">{error || "Post not found."}</div></main>;

  const date = new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const isAuthor = user && post.author?.id === user.id;

  return (
    <main className="post-detail-page">
      <article className="post-detail-content">
        <div className="post-detail-top">
          <Link to="/" className="back-link">← Back to Posts</Link>
          {isAuthor && <Link to={`/edit/${post.id}`} className="post-detail-edit-btn">✏️ Edit</Link>}
        </div>
        
        <h1 className="post-detail-title">{post.title}</h1>
        
        <div className="post-detail-meta">
          <span className="post-detail-author">{post.author?.name || "Unknown"}</span>
          <span className="post-detail-dot">·</span>
          <time className="post-detail-date">{date}</time>
        </div>

        {post.categories_detail?.length > 0 && (
          <div className="post-detail-tags">
            {post.categories_detail.map((cat) => <span key={cat.id} className="post-detail-tag">{cat.name}</span>)}
          </div>
        )}

        <div className="post-detail-body">
          {post.content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
