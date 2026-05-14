import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../api/playlist.api';
import { useAuth } from '../context/AuthContext';
import './Playlists.css';

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id) fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getUserPlaylists(user._id);
      setPlaylists(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description are required');
      return;
    }
    try {
      setCreating(true);
      setError(null);
      await createPlaylist(form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchPlaylists();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, playlistId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist(playlistId);
      setPlaylists(prev => prev.filter(p => p._id !== playlistId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete playlist');
    }
  };

  if (loading) return <div className="playlists-loading">Loading playlists...</div>;

  return (
    <div className="playlists">
      <div className="playlists-header">
        <h1>My Playlists</h1>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Playlist'}
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {showForm && (
        <form className="playlist-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Playlist name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="form-input"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="form-input"
            rows={3}
          />
          <button type="submit" disabled={creating} className="submit-btn">
            {creating ? 'Creating...' : 'Create Playlist'}
          </button>
        </form>
      )}

      <div className="playlists-grid">
        {playlists.length === 0 ? (
          <div className="empty-playlists">
            <p>No playlists yet. Create your first one!</p>
          </div>
        ) : (
          playlists.map(playlist => (
            <div key={playlist._id} className="playlist-card">
              <Link to={`/playlist/${playlist._id}`} className="playlist-link">
                <div className="playlist-thumb">
                  <span>🎬</span>
                  <span className="playlist-count">{playlist.totalVideos} videos</span>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <p>{playlist.description}</p>
                  <span className="playlist-views">{playlist.totalViews || 0} total views</span>
                  <span className="playlist-view-cta">View playlist →</span>
                </div>
              </Link>
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, playlist._id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;
