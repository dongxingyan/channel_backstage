import api from '../config'

// 获取客户信息
export const getChannelInfo = (params) => {
  return api.get(`v1/admin/channels/${params.channelId}/index`, params)
}
// 获取实时会议信息
export const getActiveConferences = (params) => {
  return api.get(`v1/admin/accounts/${params.accountId}/activeConferences`, params)
}
// 获取参会者信息
export const getParticipantsInfo = (params) => {
  return api.get(`v1/admin/accounts/${params.accountId}/activeConferences/${params.meetingRoomNum}/participants`, params)
}
// 获取参会者媒体信息
export const getMediaInfo = (params) => {
  return api.get(`v1/admin/accounts/${params.accountId}/activeConferences/${params.meetingRoomNum}/participants/${params.id}/media`, params)
}
