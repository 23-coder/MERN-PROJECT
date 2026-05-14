import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSubscribedChannels } from '../api/subscription.api';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    getSubscribedChannels(user._id)
      .then((res) => {
        const raw = res.data.data || [];
        setSubscriptions(raw.map((s) => s.subscribedChannel).filter(Boolean));
      })
      .catch(() => setSubscriptions([]));
  }, [user?._id]);

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
          {subscriptions.length === 0 ? (
            <p className="sidebar-empty">No subscriptions yet</p>
          ) : (
            subscriptions.map((ch) => (
              <Link key={ch._id} to={`/channel/${ch.username}`} className="sidebar-link sidebar-channel">
                {ch.avatar && (
                  <img
                    src={ch.avatar}
                    alt={ch.username}
                    className="sidebar-avatar"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
                <span>{ch.username}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
