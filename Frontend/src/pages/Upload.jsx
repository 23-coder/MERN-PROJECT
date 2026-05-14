import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../api/video.api';
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'videoFile' || e.target.name === 'thumbnail') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.videoFile) {
        setError("Please select a video file");
        return;
      }
      if (!formData.thumbnail) {
        setError("Please select a thumbnail image");
        return;
      }
      if (!formData.title.trim()) {
        setError("Please enter a video title");
        return;
      }
      if (!formData.description.trim()) {
        setError("Please enter a video description");
        return;
      }

      const uploadData = new FormData();
      uploadData.append('videoFile', formData.videoFile);
      uploadData.append('thumbnail', formData.thumbnail);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);

      await publishVideo(uploadData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
