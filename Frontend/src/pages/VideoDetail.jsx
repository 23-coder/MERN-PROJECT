import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoById } from '../api/video.api';
import { getVideoComments, addComment } from '../api/comment.api';
import { toggleVideoLike } from '../api/like.api';
import { toggleSubscription } from '../api/subscription.api';
import { useAuth } from '../context/AuthContext';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching video:', videoId);
      const response = await getVideoById(videoId);
      console.log('Video response:', response.data);
      
      if (response.data.data) {
        setVideo(response.data.data);
      } else {
        setError('Video data not found in response');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for video:', videoId);
      const response = await getVideoComments(videoId);
      console.log('Comments response:', response.data);
      const data = response.data.data;
      // aggregatePaginate returns { docs: [] }, plain array is a fallback
      setComments(Array.isArray(data) ? data : data?.docs || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment(videoId, { content: commentText });
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await toggleVideoLike(videoId);
      setIsLiked(res.data.data.isLiked);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      const res = await toggleSubscription(video.owner._id);
      setIsSubscribed(res.data.data.subscribed);
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  if (loading) return <div className="loading">Loading video...</div>;
  if (error) return <div className="error" style={{padding: '20px', color: 'red'}}>Error: {error}</div>;
  if (!video) return <div className="error" style={{padding: '20px', color: 'red'}}>Video not found</div>;

  return (
    <div className="video-detail">
      <div className="video-player">
        <video controls>
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="video-info-detail">
        <h1>{video.title}</h1>

        <div className="video-meta">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="video-actions">
          <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
            👍 {isLiked ? 'Liked' : 'Like'}
          </button>
          <button className="action-btn" onClick={() => {
            if (navigator.share) {
              navigator.share({ title: video.title, url: window.location.href })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied to clipboard!')
            }
          }}>🔗 Share</button>
        </div>

        <div className="video-channel">
          <div className="channel-info">
            <Link to={`/channel/${video.owner?.username}`}>
              <img
                src={video.owner?.avatar || 'https://placehold.co/50x50'}
                alt={video.owner?.username || 'Channel'}
                onError={(e) => { e.target.src = 'https://placehold.co/50x50' }}
              />
            </Link>
            <div>
              <Link to={`/channel/${video.owner?.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{video.owner?.username || 'Unknown Channel'}</h3>
              </Link>
              <p>{video.owner?.fullName}</p>
            </div>
          </div>
          {user && video.owner?.username && user.username !== video.owner.username && (
            <button
              onClick={handleSubscribe}
              className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        <div className="video-description">
          <h3>Description</h3>
          <p>{video.description}</p>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>

        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="comment-input"
          />
          <button type="submit" className="comment-btn">Comment</button>
        </form>

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <img src={comment.owner?.avatar} alt={comment.owner?.username} />
              <div className="comment-content">
                <p className="comment-author">{comment.owner?.username}</p>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
