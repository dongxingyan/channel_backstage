import api from '../config'

// 获取终端账号
export const getTeminalAccount = (params) => {
  return api.get(`/v1/admin/channels/${params.channelId}/terminalAccounts`, params)
}

// 修改终端密码
export const alterTeminalPassword = (params) => {
  return api.put(`/v1/admin/channels/${params.channelId}/terminalAccounts/${params.id}`, params)
}
