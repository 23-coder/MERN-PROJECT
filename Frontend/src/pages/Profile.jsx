import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  return (
    <div className="profile">
      <div className="profile-header">
        <img src={user?.avatar} alt={user?.username} className="profile-avatar" />
        <div className="profile-info">
          <h1>{user?.fullName}</h1>
          <p>@{user?.username}</p>
          <p>{user?.subscribersCount} subscribers</p>
        </div>
      </div>

      <div className="profile-content">
        <h2>Channel Description</h2>
        <p>{user?.description || 'No description yet'}</p>
      </div>
    </div>
  );
};

export default Profile;
