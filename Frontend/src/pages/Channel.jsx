import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getChannelProfile } from '../api/auth.api';
import { getAllVideos } from '../api/video.api';
import { toggleSubscription } from '../api/subscription.api';
import { getUserTweets } from '../api/tweet.api';
import { toggleTweetLike } from '../api/like.api';
import { useAuth } from '../context/AuthContext';
import './Channel.css';

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      const res = await getChannelProfile(username);
      const channelData = res.data.data;
      setChannel(channelData);
      setIsSubscribed(channelData.isSubscribed);

      const [videosRes, tweetsRes] = await Promise.all([
        getAllVideos({ userId: channelData._id }),
        getUserTweets(channelData._id),
      ]);
      setVideos(videosRes.data.data?.docs || []);
      setTweets(tweetsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching channel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await toggleSubscription(channel._id);
      setIsSubscribed(res.data.data.subscribed);
      setChannel(prev => ({
        ...prev,
        subscribersCount: prev.subscribersCount + (res.data.data.subscribed ? 1 : -1),
      }));
    } catch {
      // silently ignore
    }
  };

  const handleTweetLike = async (tweetId) => {
    if (!user) { navigate('/login'); return; }

    setTweets(prev => prev.map(t =>
      t._id === tweetId
        ? { ...t, isLiked: !t.isLiked, likesCount: (t.likesCount || 0) + (t.isLiked ? -1 : 1) }
        : t
    ));

    try {
      await toggleTweetLike(tweetId);
    } catch {
      setTweets(prev => prev.map(t =>
        t._id === tweetId
          ? { ...t, isLiked: !t.isLiked, likesCount: (t.likesCount || 0) + (t.isLiked ? -1 : 1) }
          : t
      ));
    }
  };

  if (loading) return <div className="channel-loading">Loading channel...</div>;
  if (!channel) return <div className="channel-error">Channel not found</div>;

  return (
    <div className="channel">
      <div
        className="channel-banner"
        style={{ backgroundImage: channel.coverImage ? `url(${channel.coverImage})` : undefined }}
      />

      <div className="channel-header">
        <img
          className="channel-avatar"
          src={channel.avatar || 'https://placehold.co/80x80'}
          alt={channel.username}
          onError={(e) => { e.target.src = 'https://placehold.co/80x80' }}
        />
        <div className="channel-meta">
          <h1>{channel.fullName}</h1>
          <p className="channel-username">@{channel.username}</p>
          <p className="channel-stats">
            {channel.subscribersCount} subscribers &bull; {videos.length} videos
          </p>
        </div>
        {user && user.username !== channel.username && (
          <button
            className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
            onClick={handleSubscribe}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      <div className="channel-tabs">
        {['videos', 'tweets'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="channel-content">
        {activeTab === 'videos' && (
          <div className="videos-grid">
            {videos.length === 0 ? (
              <p className="empty-msg">No videos uploaded yet.</p>
            ) : (
              videos.map(video => (
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
                    <p className="video-stats">{video.views} views &bull; {new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'tweets' && (
          <div className="tweets-list">
            {tweets.length === 0 ? (
              <p className="empty-msg">No tweets yet.</p>
            ) : (
              tweets.map(tweet => (
                <div key={tweet._id} className="tweet-card">
                  <div className="tweet-header">
                    <img
                      src={tweet.ownerDetails?.avatar || 'https://placehold.co/36x36'}
                      alt={tweet.ownerDetails?.username}
                      className="tweet-avatar"
                      onError={(e) => { e.target.src = 'https://placehold.co/36x36' }}
                    />
                    <div>
                      <span className="tweet-username">{tweet.ownerDetails?.username}</span>
                      <span className="tweet-date">{new Date(tweet.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="tweet-content">{tweet.content}</p>
                  <button
                    className={`tweet-like-btn ${tweet.isLiked ? 'tweet-liked' : ''}`}
                    onClick={() => handleTweetLike(tweet._id)}
                  >
                    👍 {tweet.likesCount || 0}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
