import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Interceptor to add auth token and handle FormData
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Only set Content-Type for non-FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  } else {
    // Let browser set Content-Type for FormData
    delete config.headers['Content-Type'];
  }
  
  return config;
});

export const authAPI = {
  register: (data) => apiClient.post('/users/register', data),
  login: (data) => apiClient.post('/users/login', data),
  logout: () => apiClient.post('/users/logout'),
  getCurrentUser: () => apiClient.get('/users/current-user'),
  updateProfile: (data) => apiClient.patch('/users/update-account', data),
  changePassword: (data) => apiClient.post('/users/change-password', data),
};

export const videoAPI = {
  getAllVideos: (params) => apiClient.get('/videos', { params }),
  uploadVideo: (data) => apiClient.post('/videos', data),
  getVideoById: (id) => apiClient.get(`/videos/${id}`),
  updateVideo: (id, data) => apiClient.patch(`/videos/${id}`, data),
  deleteVideo: (id) => apiClient.delete(`/videos/${id}`),
  togglePublishStatus: (id) => apiClient.patch(`/videos/toggle/publish/${id}`),
};

export const commentAPI = {
  getVideoComments: (videoId) => apiClient.get(`/comments/${videoId}`),
  addComment: (videoId, data) => apiClient.post(`/comments/${videoId}`, data),
  updateComment: (commentId, data) => apiClient.patch(`/comments/c/${commentId}`, data),
  deleteComment: (commentId) => apiClient.delete(`/comments/c/${commentId}`),
};

export const likeAPI = {
  toggleVideoLike: (videoId) => apiClient.post(`/likes/toggle/v/${videoId}`),
  toggleCommentLike: (commentId) => apiClient.post(`/likes/toggle/c/${commentId}`),
  toggleTweetLike: (tweetId) => apiClient.post(`/likes/toggle/t/${tweetId}`),
  getLikedVideos: () => apiClient.get('/likes/videos'),
};

export const subscriptionAPI = {
  toggleSubscription: (channelId) => apiClient.post(`/subscriptions/c/${channelId}`),
  getUserChannelSubscribers: (channelId) => apiClient.get(`/subscriptions/c/${channelId}`),
  getSubscribedChannels: (subscriberId) => apiClient.get(`/subscriptions/u/${subscriberId}`),
};

export const playlistAPI = {
  getAllPlaylists: () => apiClient.get('/playlist'),
  createPlaylist: (data) => apiClient.post('/playlist', data),
  getPlaylistById: (id) => apiClient.get(`/playlist/${id}`),
  addVideoToPlaylist: (playlistId, videoId) => apiClient.patch(`/playlist/${playlistId}/${videoId}`),
  removeVideoFromPlaylist: (playlistId, videoId) => apiClient.patch(`/playlist/${playlistId}/remove/${videoId}`),
  deletePlaylist: (id) => apiClient.delete(`/playlist/${id}`),
  updatePlaylist: (id, data) => apiClient.patch(`/playlist/${id}`, data),
};

export const tweetAPI = {
  getAllTweets: () => apiClient.get('/tweets'),
  createTweet: (data) => apiClient.post('/tweets', data),
  updateTweet: (id, data) => apiClient.patch(`/tweets/${id}`, data),
  deleteTweet: (id) => apiClient.delete(`/tweets/${id}`),
  getUserTweets: (userId) => apiClient.get(`/tweets/user/${userId}`),
};

export const dashboardAPI = {
  getChannelStats: () => apiClient.get('/dashboard/stats'),
  getChannelVideos: () => apiClient.get('/dashboard/videos'),
};

export default apiClient;
