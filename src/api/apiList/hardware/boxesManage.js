import api from '../../config'
// 模糊查询所有盒子的接口,
export const queryBoxes = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/boxes`, params)
}

// 添加盒子
export const addBox = (body, pathParams) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/boxes?orgId=${pathParams.orgId}`, body)
}

// 编辑修改盒子信息
export const updateBox = (params) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/boxes`, params)
}

// 分配盒子
export const dispatchBoxes = (params, pathParams) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/allotBoxes?orgId=${pathParams.orgId}`, params)
}

// 上传excel
export const uploadExcel = (formData) => {
  return api.uploadPost(`/v1/admin/common/uploadExcel?businessId=${sessionStorage.accountId}&businessType=excel&token=${sessionStorage.userToken}`, formData)
}

// 导入盒子信息
export const importBoxes = (params) => {
  return api.post(`/v1/admin/accounts/${sessionStorage.accountId}/importBoxes`, params)
}

// 删除盒子
export const deleteBoxes = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/delBoxes`, params)
}
