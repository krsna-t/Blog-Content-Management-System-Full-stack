import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span> BlogCMS
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/create" className="nav-link nav-link--create">+ New Post</Link>
              <span className="nav-user">{user.name}</span>
              <button onClick={handleLogout} className="nav-link nav-link--logout" id="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="login-link">Login</Link>
              <Link to="/register" className="nav-link nav-link--primary" id="register-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
