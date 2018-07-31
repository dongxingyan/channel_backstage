/* apk 接口 */
import api from '../../config'

// 根据名称模糊查询所有apk的接口
export const queryApks = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/apks`, params)
}

// 新增apk
export const addApk = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/apks`, params)
}

// 修改apk信息的接口
export const updateApk = (params) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/apks`, params)
}

// apk上下线
export const apkOnline = (params) => {
  return api.put(`/v1/admin/accounts/${sessionStorage.accountId}/apks/${params.apkId}`, params)
}

// 删除apk,由于accountId 不好传参
export const apkDelete = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/delApks`, params)
}

// 查询apk版本的接口
export const queryApkVersion = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/apks/${params.apkId}/version`, params)
}

// 新增apk版本的接口
export const addApkVersion = (params) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/apks/version`, params)
}

// 修改apk版本的接口
export const alterApkVersion = (params) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/apks/version`, params)
}

// 删除Apk版本接口
export const deleteApkVersion = (params) => {
  return api.delete(`/v1/admin/accounts/${sessionStorage.accountId}/apks/version`, params)
}

// 文件上传接口
export const uploadFile = (formData) => {
  return api.uploadPost(`/v1/admin/common/upload?businessId=${sessionStorage.accountId}&businessType=apk&token=${sessionStorage.userToken}`, formData)
}
