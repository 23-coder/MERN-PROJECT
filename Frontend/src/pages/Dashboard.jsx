import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoAPI } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalVideos: 0,
    totalSubscribers: 0,
    totalLikes: 0,
  });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      fetchUserVideos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (user?._id) params.userId = user._id;
      const response = await videoAPI.getAllVideos(params);
      const userVideos = response.data.data?.docs || [];
      
      setVideos(userVideos);
      setStats({
        totalViews: userVideos.reduce((sum, v) => sum + (v.views || 0), 0),
        totalVideos: userVideos.length,
        totalSubscribers: 0,
        totalLikes: 0,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Views</h3>
          <p className="stat-number">{stats.totalViews}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Videos</h3>
          <p className="stat-number">{stats.totalVideos}</p>
        </div>
        <div className="dashboard-card">
          <h3>Subscribers</h3>
          <p className="stat-number">{stats.totalSubscribers}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Likes</h3>
          <p className="stat-number">{stats.totalLikes}</p>
        </div>
      </div>

      <h2 style={{ marginTop: '32px' }}>Your Videos</h2>
      {error && <div style={{color: 'red', marginBottom: '16px'}}>Error: {error}</div>}
      <div className="videos-list">
        {videos.length === 0 ? (
          <p>No videos uploaded yet. <Link to="/upload">Upload your first video!</Link></p>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="video-item" style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <small>
                  Status: <strong>{video.isPublished ? '✅ Published' : '⏳ Unpublished'}</strong> | 
                  Views: {video.views || 0} | 
                  Duration: {video.duration || 0}s
                </small>
              </div>
              <Link to={`/video/${video._id}`} style={{padding: '8px 16px', background: '#007bff', color: 'white', borderRadius: '4px', textDecoration: 'none'}}>
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
