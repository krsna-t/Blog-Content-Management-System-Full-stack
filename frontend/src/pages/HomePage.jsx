import { useEffect, useState } from "react";
import { getPosts } from "../api/services";
import PostCard from "../components/PostCard";
import "./HomePage.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (query.trim()) params.search = query.trim();
      const { data } = await getPosts(params);
      setPosts(data.results ?? data);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchPosts(search); };

  return (
    <main className="home-page">
      <section className="home-hero">
        <h1 className="home-hero__title">Explore Posts</h1>
        <p className="home-hero__subtitle">Discover stories, insights, and ideas from our community.</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input type="text" placeholder="Search posts by title…" value={search} onChange={(e) => setSearch(e.target.value)} className="search-bar__input" />
          <button type="submit" className="search-bar__btn">Search</button>
        </form>
      </section>
      <section className="post-feed">
        {loading && <div className="feed-status"><div className="spinner" /></div>}
        {error && <div className="feed-status feed-status--error">{error}</div>}
        {!loading && !error && posts.length === 0 && <div className="feed-status">No posts found.</div>}
        {!loading && posts.map((post) => <PostCard key={post.id} post={post} />)}
      </section>
    </main>
  );
}
