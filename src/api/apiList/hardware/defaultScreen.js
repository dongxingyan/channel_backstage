import api from '../../config'

// 首屏豆腐块管理接口
export const tofuManageInfo = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubeScreen`, {})
}

// 所有有效豆腐块查询接口
export const queryValidTofus = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/allBeanCurdCubes`, {})
}

// 文件上传接口
export const uploadFile = (formData) => {
  return api.uploadPost(`/v1/admin/common/upload?businessId=${sessionStorage.accountId}&businessType=screenLogo&token=${sessionStorage.userToken}`, formData)
}

// 首屏豆腐块编辑接口
export const editScreenList = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubeScreens`, params)
}
