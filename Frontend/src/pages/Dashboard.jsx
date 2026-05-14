import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChannelStats, getChannelVideos } from '../api/dashboard.api';
import { togglePublish, deleteVideo } from '../api/video.api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, videosRes] = await Promise.all([
        getChannelStats(),
        getChannelVideos(),
      ]);
      setStats(statsRes.data.data);
      setVideos(videosRes.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      setTogglingId(videoId);
      await togglePublish(videoId);
      setVideos(prev =>
        prev.map(v => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle publish status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Delete this video permanently?')) return;
    try {
      setDeletingId(videoId);
      await deleteVideo(videoId);
      setVideos(prev => prev.filter(v => v._id !== videoId));
      setStats(prev => prev ? { ...prev, totalVideos: prev.totalVideos - 1 } : prev);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="dashboard"><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <h1>Dashboard</h1>
        <Link to="/upload" className="upload-link">⬆️ Upload Video</Link>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Views</h3>
          <p className="stat-number">{stats?.totalViews?.toLocaleString() ?? 0}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Videos</h3>
          <p className="stat-number">{stats?.totalVideos ?? 0}</p>
        </div>
        <div className="dashboard-card">
          <h3>Subscribers</h3>
          <p className="stat-number">{stats?.totalSubscribers?.toLocaleString() ?? 0}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Likes</h3>
          <p className="stat-number">{stats?.totalLikes?.toLocaleString() ?? 0}</p>
        </div>
      </div>

      <h2 style={{ margin: '32px 0 16px' }}>Your Videos</h2>
      <div className="videos-table">
        {videos.length === 0 ? (
          <div className="no-videos-msg">
            <p>No videos yet. <Link to="/upload">Upload your first video!</Link></p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Video</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video._id}>
                  <td>
                    <div className="video-cell">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        onError={(e) => { e.target.src = 'https://placehold.co/120x68' }}
                      />
                      <div>
                        <p className="video-cell-title">{video.title}</p>
                        <p className="video-cell-date">{new Date(video.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${video.isPublished ? 'published' : 'draft'}`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{video.views || 0}</td>
                  <td>{video.likesCount || 0}</td>
                  <td>
                    <div className="action-btns">
                      <Link to={`/video/${video._id}`} className="action-link">View</Link>
                      <button
                        className="toggle-btn"
                        onClick={() => handleTogglePublish(video._id)}
                        disabled={togglingId === video._id}
                      >
                        {togglingId === video._id ? '...' : video.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(video._id)}
                        disabled={deletingId === video._id}
                      >
                        {deletingId === video._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
