import React from 'react';
import { useParams } from 'react-router-dom';
import './Channel.css';

const Channel = () => {
  const { channelId } = useParams();

  return (
    <div className="channel">
      <div className="channel-banner">Channel Banner</div>
      <div className="channel-info-section">
        <h1>Channel Name</h1>
        <p>Channel Videos and Content</p>
      </div>
    </div>
  );
};

export default Channel;
