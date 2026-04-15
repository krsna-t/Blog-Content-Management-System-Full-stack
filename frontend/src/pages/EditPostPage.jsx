import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost, getCategories } from "../api/services";
import "./CreatePostPage.css";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", status: "draft", category_ids: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catRes] = await Promise.all([getPost(id), getCategories()]);
        const post = postRes.data;
        setCategories(catRes.data.results ?? catRes.data);
        setForm({ title: post.title, content: post.content, status: post.status, category_ids: post.categories_detail?.map((c) => c.id) || [] });
      } catch { setError("Failed to load post."); }
      finally { setFetching(false); }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => { setForm({ ...form, category_ids: Array.from(e.target.selectedOptions, (o) => Number(o.value)) }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updatePost(id, form);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data && typeof data === "object" ? Object.values(data).flat().join(" ") : "Failed to update post.");
    } finally { setLoading(false); }
  };

  if (fetching) return <main className="create-page"><div style={{ textAlign: "center", padding: "3rem" }}><div className="spinner" /></div></main>;

  return (
    <main className="create-page">
      <form className="create-card" onSubmit={handleSubmit}>
        <h1 className="create-title">Edit Post</h1>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Post title" />
        </div>
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
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? "Saving…" : "Save Changes"}</button>
        </div>
      </form>
    </main>
  );
}
