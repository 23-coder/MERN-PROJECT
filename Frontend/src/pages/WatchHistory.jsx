import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWatchHistory } from '../api/auth.api';
import './WatchHistory.css';

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getWatchHistory();
      setVideos(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load watch history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="wh-loading">Loading watch history...</div>;
  if (error) return <div className="wh-loading wh-error">{error}</div>;

  return (
    <div className="watch-history">
      <h1>Watch History</h1>
      {videos.length === 0 ? (
        <div className="wh-empty">
          <p>You haven't watched any videos yet.</p>
          <Link to="/" className="wh-browse">Browse videos</Link>
        </div>
      ) : (
        <div className="wh-list">
          {videos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}`} className="wh-row">
              <div className="wh-thumb">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  onError={(e) => { e.target.src = 'https://placehold.co/160x90' }}
                />
                <span className="wh-duration">
                  {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </span>
              </div>
              <div className="wh-info">
                <h3>{video.title}</h3>
                <p className="wh-channel">{video.owner?.username || 'Unknown'}</p>
                <p className="wh-stats">{video.views || 0} views</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
