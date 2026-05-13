import React, { useState, useEffect } from 'react';
import { likeAPI } from '../api/apiService';
import './LikedVideos.css';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      const response = await likeAPI.getLikedVideos();
      setVideos(response.data.data || []);
    } catch (error) {
      console.error('Error fetching liked videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="liked-videos">
      <h1>Liked Videos</h1>
      <div className="videos-grid">
        {videos.length === 0 ? <p>No liked videos yet</p> : null}
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <div className="thumbnail">{video.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
