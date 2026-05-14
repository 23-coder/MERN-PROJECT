import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLikedVideos } from '../api/like.api';
import './LikedVideos.css';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      const response = await getLikedVideos();
      const docs = response.data.data?.docs || response.data.data || [];
      setVideos(docs.map(item => item.likedVideo || item).filter(Boolean));
    } catch (error) {
      console.error('Error fetching liked videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="liked-loading">Loading liked videos...</div>;

  return (
    <div className="liked-videos">
      <h1>Liked Videos</h1>
      {videos.length === 0 ? (
        <div className="liked-empty">
          <p>You haven't liked any videos yet.</p>
          <Link to="/" className="browse-link">Browse videos</Link>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}`} className="video-card">
              <div className="video-thumbnail">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  onError={(e) => { e.target.src = 'https://placehold.co/320x180' }}
                />
                <span className="video-duration">
                  {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </span>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">{video.ownerDetails?.username || video.owner?.username}</p>
                <p className="video-stats">
                  {video.views} views &bull; {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
