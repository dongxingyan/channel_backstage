import api from '../config'

// 模糊查询客户管理列表
export const getCustomerList = (params) => {
  return api.get(`v1/admin/channels/${params.channelId}/organizations`, params)
}

// 新建客户
export const createCustomer = (params) => {
  if (params.organName) {
    params.organName = params.organName.replace(/(^\s*)|(\s*$)/g, '')
  }
  return api.post(`v1/admin/channels/${params.channelId}/organizations`, params)
}

// 根据客户ID获取客户详情
export const getCustomerInfoByID = (params) => {
  return api.get(`v1/admin/channels/${params.channelId}/organizations/${params.id}`, params)
}

// 根据客户ID修改客户信息
export const updateCustomerInfoByID = (params) => {
  if (params.name) {
    params.name = params.name.replace(/(^\s*)|(\s*$)/g, '')
  }
  return api.putUpdCustomer(`v1/admin/channels/${sessionStorage.getItem('channelId')}/organizations/${params.id}`, params)
}
