import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateAccount, updateAvatar, updateCoverImage } from '../api/auth.api';
import './Profile.css';

const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError('Full name and email are required');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await updateAccount(formData);
      await checkAuth();
      setEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setError(null);
      const form = new FormData();
      form.append('avatar', file);
      await updateAvatar(form);
      await checkAuth();
      setSuccess('Avatar updated');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar');
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <label className="profile-avatar-label" title="Click to change avatar">
          <img
            src={user?.avatar || 'https://placehold.co/100x100'}
            alt={user?.username}
            className="profile-avatar"
            onError={(e) => { e.target.src = 'https://placehold.co/100x100' }}
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        </label>
        <div className="profile-info">
          <h1>{user?.fullName}</h1>
          <p>@{user?.username}</p>
          <p>{user?.email}</p>
        </div>
        <button className="edit-btn" onClick={() => { setEditing(!editing); setError(null); }}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}

      {editing && (
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <button type="submit" disabled={saving} className="save-btn">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
