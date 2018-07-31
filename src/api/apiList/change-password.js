import api from '../config'

// 修改密码
export const alterPassword = (params) => {
  return api.put(`/v1/admin/channels/${params.channelId}/userPassword`, params)
}
