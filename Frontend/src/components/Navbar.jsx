import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">PlayTube</span>
        </Link>

        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/upload" className="upload-btn">
                ⬆️ Upload
              </Link>
              <div className="user-menu">
                <button
                  className="user-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>👤</span>
                  )}
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                      Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setShowDropdown(false)}>
                      Dashboard
                    </Link>
                    <Link to="/playlists" onClick={() => setShowDropdown(false)}>
                      Playlists
                    </Link>
                    <Link to="/liked-videos" onClick={() => setShowDropdown(false)}>
                      Liked Videos
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign in
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
