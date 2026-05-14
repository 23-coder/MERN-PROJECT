import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateAccount, updateAvatar, changePassword } from '../api/auth.api';
import './Profile.css';

const Profile = () => {
  const { user, checkAuth } = useAuth();

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Change password state
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  const flash = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(null), 3000);
  };

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
      flash(setSuccess, 'Profile updated successfully');
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
      flash(setSuccess, 'Avatar updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwData.oldPassword || !pwData.newPassword || !pwData.confirmPassword) {
      setPwError('All password fields are required');
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwError('New password and confirm password do not match');
      return;
    }
    try {
      setPwSaving(true);
      setPwError(null);
      await changePassword({ oldPassword: pwData.oldPassword, newPassword: pwData.newPassword });
      setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      flash(setPwSuccess, 'Password changed successfully');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
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

      <div className="profile-divider" />

      <div className="profile-section">
        <h2 className="profile-section-title">Security</h2>
        {pwError && <div className="profile-error">{pwError}</div>}
        {pwSuccess && <div className="profile-success">{pwSuccess}</div>}
        <form className="profile-form" onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={pwData.oldPassword}
              onChange={e => setPwData({ ...pwData, oldPassword: e.target.value })}
              className="form-input"
              placeholder="Enter current password"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={pwData.newPassword}
              onChange={e => setPwData({ ...pwData, newPassword: e.target.value })}
              className="form-input"
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={pwData.confirmPassword}
              onChange={e => setPwData({ ...pwData, confirmPassword: e.target.value })}
              className="form-input"
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" disabled={pwSaving} className="save-btn">
            {pwSaving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
