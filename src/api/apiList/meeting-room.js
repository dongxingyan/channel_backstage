import api from '../config'

// 模糊查询会议室管理列表
export const getMeetingList = (params) => {
  return api.get(`v1/admin/channels/${params.channelId}/meetingRooms`, params)
}

// 根据客户ID修改会议室信息
export const updateMeetingInfoByID = (params) => {
  let channelId = sessionStorage.channelId
  return api.putJson(`v1/admin/channels/${channelId}/meetingRooms/${params.id}`, params)
}

//
export const reqGetThemes = ({selectAccountId}) => {
  let accountId = sessionStorage.accountId
  let language = localStorage.lang == 'zh-CN' ? 'cn' : 'en'
  return api.get(`v1/admin/accounts/${accountId}/info/themes`, { selectAccountId, type: 'meeting', language })
}
