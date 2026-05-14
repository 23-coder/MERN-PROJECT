import api from './axiosInstance'

export const getAllVideos = (params) => api.get('/videos', { params })
export const getVideoById = (videoId) => api.get(`/videos/${videoId}`)
export const publishVideo = (formData) => api.post('/videos', formData)
export const updateVideo = (videoId, data) => api.patch(`/videos/${videoId}`, data)
export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`)
export const togglePublish = (videoId) => api.patch(`/videos/toggle/publish/${videoId}`)
