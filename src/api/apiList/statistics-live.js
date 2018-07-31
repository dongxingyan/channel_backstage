import api from '../config'

// 获取直播统计相关 数据
export const getLiveCountData = (params) => {
  return api.get(`v1/stats/channel/${sessionStorage.getItem('channelId')}/live`, params)
}

// 获取导出报表URL
export const getOutputURL = (params) => {
  return api.get(`v1/stats/channel/${sessionStorage.getItem('channelId')}/exportLiveData`, params)
}
