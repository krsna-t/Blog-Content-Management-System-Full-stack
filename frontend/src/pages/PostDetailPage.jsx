import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "../api/services";
import { useAuth } from "../context/AuthContext";
import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPost(id)
      .then(({ data }) => setPost(data))
      .catch(() => setError("Failed to load the post. It might have been deleted."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        navigate("/");
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div className="post-detail__error">{error}</div>;
  if (!post) return null;

  const date = new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const isAuthor = user && post.author?.id === user.id;

  return (
    <article className="post-detail">
      <div className="post-detail__header">
        <Link to="/" className="post-detail__back">← Back to Posts</Link>
        <div className="post-detail__actions">
          {post.status === "draft" && <span className="post-detail__badge">Draft</span>}
          {isAuthor && (
            <>
              <Link to={`/edit/${post.id}`} className="post-detail__edit-btn">✏️ Edit</Link>
              <button onClick={handleDelete} className="post-detail__delete-btn">🗑️ Delete</button>
            </>
          )}
        </div>
      </div>

      <h1 className="post-detail__title">{post.title}</h1>
      
      <div className="post-detail__meta">
        <span className="post-detail__author">By {post.author?.name || "Unknown"}</span>
        <span className="post-detail__dot">·</span>
        <time className="post-detail__date">{date}</time>
      </div>

      {post.categories_detail?.length > 0 && (
        <div className="post-detail__tags">
          {post.categories_detail.map((cat) => (
            <span key={cat.id} className="post-detail__tag">{cat.name}</span>
          ))}
        </div>
      )}

      <div className="post-detail__content">
        {post.content.split("\n").map((par, i) => (
          <p key={i}>{par}</p>
        ))}
      </div>
    </article>
  );
}
