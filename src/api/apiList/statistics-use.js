import api from '../config'

// 获取会议室使用次数 数据
export const getConferenceData = (params) => {
  return api.get(`v1/stats/channel/${sessionStorage.getItem('channelId')}/conferenceCount`, params)
}

// 获取最该并发 数据
export const getConcurrentData = (params) => {
  return api.get(`v1/stats/channel/${sessionStorage.getItem('channelId')}/simultaneous`, params)
}

// 获取会议时长 数据
export const getDurationData = (params) => {
  return api.get(`v1/stats/channel/${sessionStorage.getItem('channelId')}/duration`, params)
}

// 获取导出报表 URL
export const getOutputURL = (params) => {
  return api.get(`v1/stats/channel/${sessionStorage.getItem('channelId')}/exportConferenceData`, params)
}
