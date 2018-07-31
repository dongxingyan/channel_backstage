/* 豆腐块接口 */
import api from '../../config'

// 查询所有apk接口（渠道管理：查询当前渠道和所有渠道下机构的apk；）
export const queryTofus = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes`, params)
}

// 豆腐块修改接口
export const alterTofu = (params) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes`, params)
}

// 豆腐块删除接口
export const deleteTofus = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/delBeanCurdCubes`, params)
}

// 豆腐块增加接口
export const addTofu = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes`, params)
}

// 查询豆腐块可以对应的所有apk
export const queryRefApks = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}`, params)
}

// 文件上传接口
export const uploadFile = (formData) => {
  return api.uploadPost(`/v1/admin/common/upload?businessId=${sessionStorage.accountId}&businessType=tofu&token=${sessionStorage.userToken}`, formData)
}

// 豆腐块详情查询接口
export const queryTofuDetail = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes/${params.beanCurdCubeId}/details`, params)
}

// 豆腐块详情新增接口
export const addTofuDetail = (body, urlParams) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes/${urlParams.beanCurdCubeId}/details`, body)
}

// 豆腐块详情修改接口
export const alterTofuDetail = (body, urlParams) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes/${urlParams.beanCurdCubeId}/details`, body)
}

// 豆腐块详情删除接口
export const deleteTofuDetail = (params) => {
  return api.delete(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubes/${params.tofuId}/details/${params.detailId}`, params)
}
