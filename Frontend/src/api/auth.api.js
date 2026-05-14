import api from './axiosInstance'

export const registerUser = (formData) => api.post('/users/register', formData)
export const loginUser = (data) => api.post('/users/login', data)
export const logoutUser = () => api.post('/users/logout')
export const getCurrentUser = () => api.get('/users/current-user')
export const updateAccount = (data) => api.patch('/users/update-account', data)
export const changePassword = (data) => api.post('/users/change-password', data)
export const updateAvatar = (formData) => api.patch('/users/avatar', formData)
export const updateCoverImage = (formData) => api.patch('/users/cover-image', formData)
export const getChannelProfile = (username) => api.get(`/users/c/${username}`)
export const getWatchHistory = () => api.get('/users/history')
