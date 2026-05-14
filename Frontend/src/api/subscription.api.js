import api from './axiosInstance'

export const toggleSubscription = (channelId) => api.post(`/subscriptions/c/${channelId}`)
export const getSubscribedChannels = (userId) => api.get(`/subscriptions/c/${userId}`)
export const getChannelSubscribers = (channelId) => api.get(`/subscriptions/u/${channelId}`)
