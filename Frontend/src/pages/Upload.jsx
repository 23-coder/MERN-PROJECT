import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../api/video.api';
import { togglePublish } from '../api/video.api';
import './Upload.css';

const Upload = () => {
  const [formData, setFormData] = useState({
    videoFile: null,
    thumbnail: null,
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'videoFile' || e.target.name === 'thumbnail') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.videoFile) { setError('Please select a video file'); return; }
      if (!formData.thumbnail) { setError('Please select a thumbnail image'); return; }
      if (!formData.title.trim()) { setError('Please enter a video title'); return; }
      if (!formData.description.trim()) { setError('Please enter a video description'); return; }

      const data = new FormData();
      data.append('videoFile', formData.videoFile);
      data.append('thumbnail', formData.thumbnail);
      data.append('title', formData.title);
      data.append('description', formData.description);

      const response = await publishVideo(data);
      setUploadedVideo(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async () => {
    try {
      setPublishing(true);
      await togglePublish(uploadedVideo._id);
      navigate(`/video/${uploadedVideo._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish. Check Dashboard to publish later.');
      setPublishing(false);
    }
  };

  if (uploadedVideo) {
    return (
      <div className="upload-container">
        <div className="upload-box upload-success-box">
          <div className="upload-success-icon">✓</div>
          <h2>Video uploaded successfully!</h2>
          <p className="upload-success-msg">
            Your video <strong>"{uploadedVideo.title}"</strong> was saved as a draft.
            Publish it now to make it visible to everyone, or save it as a draft and publish later from your Dashboard.
          </p>
          {error && <div className="error-message">{error}</div>}
          <div className="upload-success-actions">
            <button
              className="publish-now-btn"
              onClick={handlePublishNow}
              disabled={publishing}
            >
              {publishing ? 'Publishing...' : '🌍 Publish now'}
            </button>
            <button
              className="save-draft-btn"
              onClick={() => navigate('/dashboard')}
            >
              💾 Save as draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h1>Upload video</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Video File</label>
            <input
              type="file"
              name="videoFile"
              accept="video/*"
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter video title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter video description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="upload-button">
            {loading ? 'Uploading... (this may take 1–2 minutes)' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
