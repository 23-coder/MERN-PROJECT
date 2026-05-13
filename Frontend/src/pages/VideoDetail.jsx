import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { videoAPI, commentAPI, likeAPI } from '../api/apiService';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching video:', videoId);
      const response = await videoAPI.getVideoById(videoId);
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
      const response = await commentAPI.getVideoComments(videoId);
      console.log('Comments response:', response.data);
      const commentsList = response.data.data;
      // Ensure it's always an array
      setComments(Array.isArray(commentsList) ? commentsList : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await commentAPI.addComment(videoId, { content: commentText });
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      await likeAPI.toggleVideoLike(videoId);
      fetchVideo();
    } catch (error) {
      console.error('Error liking video:', error);
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
          <button onClick={handleLike} className="action-btn">
            👍 {video.likes} Like
          </button>
          <button className="action-btn">💬 Comment</button>
          <button className="action-btn">📋 Save</button>
          <button className="action-btn">⬇️ Share</button>
        </div>

        <div className="video-channel">
          <div className="channel-info">
            <img 
              src={video.owner?.avatar || 'https://via.placeholder.com/50'} 
              alt={video.owner?.username || 'Channel'} 
              onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
            />
            <div>
              <h3>{video.owner?.username || 'Unknown Channel'}</h3>
              <p>{video.owner?.subscribersCount || 0} subscribers</p>
            </div>
          </div>
          <button className="subscribe-btn">Subscribe</button>
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
