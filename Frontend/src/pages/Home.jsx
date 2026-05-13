import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { videoAPI } from '../api/apiService';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchVideos();
  }, [searchParams]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const searchQuery = searchParams.get('search');
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await videoAPI.getAllVideos(params);
      setVideos(response.data.data.docs || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home-loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="home-error">Error: {error}</div>;
  }

  return (
    <div className="home">
      <div className="videos-grid">
        {videos.length === 0 ? (
          <div className="no-videos">No videos found</div>
        ) : (
          videos.map((video) => (
            <Link
              key={video._id}
              to={`/video/${video._id}`}
              className="video-card"
            >
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-duration">
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">
                  {video.owner?.username || 'Unknown Channel'}
                </p>
                <p className="video-stats">
                  {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
