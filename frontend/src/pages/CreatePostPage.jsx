import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getCategories } from "../api/services";
import "./CreatePostPage.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", status: "draft", category_ids: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { getCategories().then(({ data }) => setCategories(data.results ?? data)).catch(() => { }); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => { setForm({ ...form, category_ids: Array.from(e.target.selectedOptions, (o) => Number(o.value)) }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createPost(form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data && typeof data === "object" ? Object.values(data).flat().join(" ") : "Failed to create post.");
    } finally { setLoading(false); }
  };

  return (
    <main className="create-page">
      <form className="create-card" onSubmit={handleSubmit}>
        <h1 className="create-title">New Post</h1>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required maxLength={100} value={form.title} onChange={handleChange} placeholder="Post title (max 100 characters)" />        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" required rows={8} value={form.content} onChange={handleChange} placeholder="Write your post…" />
        </div>
        <div className="create-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="category_ids">Categories</label>
            <select id="category_ids" name="category_ids" multiple value={form.category_ids} onChange={handleCategoryChange} className="select-multi">
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
        </div>
        <div className="create-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? "Publishing…" : "Create Post"}</button>
        </div>
      </form>
    </main>
  );
}
