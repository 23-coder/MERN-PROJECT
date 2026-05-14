import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlaylistById, deletePlaylist, removeVideoFromPlaylist } from '../api/playlist.api';
import { useAuth } from '../context/AuthContext';
import './PlaylistDetail.css';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await getPlaylistById(playlistId);
      setPlaylist(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && playlist && user.username === playlist.owner?.username;

  const handleRemoveVideo = async (videoId) => {
    try {
      setRemovingId(videoId);
      await removeVideoFromPlaylist(videoId, playlistId);
      setPlaylist(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== videoId),
        totalVideos: prev.totalVideos - 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove video');
    } finally {
      setRemovingId(null);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Delete this playlist permanently?')) return;
    try {
      setDeleting(true);
      await deletePlaylist(playlistId);
      navigate('/playlists');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete playlist');
      setDeleting(false);
    }
  };

  if (loading) return <div className="pd-loading">Loading playlist...</div>;
  if (error) return <div className="pd-error">{error}</div>;
  if (!playlist) return <div className="pd-error">Playlist not found</div>;

  return (
    <div className="playlist-detail">
      <div className="pd-header">
        <div className="pd-meta">
          <Link to="/playlists" className="pd-back">← Playlists</Link>
          <h1>{playlist.name}</h1>
          <p className="pd-desc">{playlist.description}</p>
          <p className="pd-stats">
            {playlist.totalVideos} videos &bull; {playlist.totalViews || 0} total views
          </p>
          {playlist.owner && (
            <p className="pd-owner">
              by{' '}
              <Link to={`/channel/${playlist.owner.username}`} className="pd-owner-link">
                {playlist.owner.username}
              </Link>
            </p>
          )}
        </div>
        {isOwner && (
          <button className="pd-delete-btn" onClick={handleDeletePlaylist} disabled={deleting}>
            {deleting ? 'Deleting...' : '🗑️ Delete Playlist'}
          </button>
        )}
      </div>

      {error && <div className="pd-error-inline">{error}</div>}

      <div className="pd-videos">
        {playlist.videos.length === 0 ? (
          <div className="pd-empty">No videos in this playlist yet.</div>
        ) : (
          playlist.videos.map((video) => (
            <div key={video._id} className="pd-video-row">
              <Link to={`/video/${video._id}`} className="pd-video-link">
                <div className="pd-thumb-wrap">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    onError={(e) => { e.target.src = 'https://placehold.co/160x90' }}
                  />
                  <span className="pd-duration">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                  </span>
                </div>
                <div className="pd-video-info">
                  <h3>{video.title}</h3>
                  <p>{video.views || 0} views &bull; {new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
              {isOwner && (
                <button
                  className="pd-remove-btn"
                  onClick={() => handleRemoveVideo(video._id)}
                  disabled={removingId === video._id}
                >
                  {removingId === video._id ? '...' : 'Remove'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
