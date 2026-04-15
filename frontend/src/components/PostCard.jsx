import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PostCard.css";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation if the user clicked the edit button or inside the top action bar
    if (e.target.closest('.post-card__edit-btn')) return;
    navigate(`/post/${post.id}`);
  };

  const snippet = post.content.length > 160 ? post.content.slice(0, 160) + "…" : post.content;
  const date = new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const isAuthor = user && post.author?.id === user.id;

  return (
    <article className="post-card" id={`post-card-${post.id}`} onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="post-card__top">
        {post.status === "draft" && <span className="post-card__badge post-card__badge--draft">Draft</span>}
        {isAuthor && <Link to={`/edit/${post.id}`} className="post-card__edit-btn" id={`edit-post-${post.id}`}>✏️ Edit</Link>}
      </div>
      <h2 className="post-card__title">{post.title}</h2>
      <div className="post-card__meta">
        <span className="post-card__author">{post.author?.name || "Unknown"}</span>
        <span className="post-card__dot">·</span>
        <time className="post-card__date">{date}</time>
      </div>
      {post.categories_detail?.length > 0 && (
        <div className="post-card__tags">
          {post.categories_detail.map((cat) => <span key={cat.id} className="post-card__tag">{cat.name}</span>)}
        </div>
      )}
      <p className="post-card__snippet">
        {snippet}
        <span className="post-card__read-more"> Read more...</span>
      </p>
    </article>
  );
}
