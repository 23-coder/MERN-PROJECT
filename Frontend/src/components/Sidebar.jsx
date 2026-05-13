import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3>Menu</h3>
          <Link to="/" className="sidebar-link">
            🏠 Home
          </Link>
          <Link to="/liked-videos" className="sidebar-link">
            👍 Liked Videos
          </Link>
          <Link to="/playlists" className="sidebar-link">
            📋 Playlists
          </Link>
          <Link to="/dashboard" className="sidebar-link">
            📊 Dashboard
          </Link>
        </div>

        <hr />

        <div className="sidebar-section">
          <h3>Subscriptions</h3>
          <Link to="/" className="sidebar-link">
            Channel 1
          </Link>
          <Link to="/" className="sidebar-link">
            Channel 2
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
