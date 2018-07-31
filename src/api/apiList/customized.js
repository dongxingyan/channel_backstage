import api from '../config'

// 客户后台管理系统 获取信息
export const getInfoAdminBackstage = (params) => {
  return api.get(`/v1/admin/accounts/${params.accountId}/info/adminCustomized`, params)
}

// 客户后台管理系统 修改信息
export const updateInfoAdminBackstage = (params, urlData) => {
  return api.putJson(`/v1/admin/accounts/${urlData.accountId}/info/adminCustomized/${urlData.id}?token=${sessionStorage.userToken}`, params)
}

// meeting系统 获取信息
export const getInfoOfMeeting = (params) => {
  return api.get(`/v1/admin/accounts/${params.accountId}/info/meetingCustomized`, params)
}

// meeting系统 修改信息
export const updateInfoOfMeeting = (params, urlData) => {
  return api.putJson(`/v1/admin/accounts/${urlData.accountId}/info/meetingCustomized/${urlData.id}?token=${sessionStorage.userToken}`, params)
}

// iOS mobile 获取信息
export const getInfoIOSMobile = (params) => {
  return api.get(`/v1/admin/accounts/${params.accountId}/info/iOSMobileCustomized`, params, true)
}

// iOS mobile 修改信息
export const updateInfoIOSMobile = (params, urlData) => {
  return api.putJson(`/v1/admin/accounts/${urlData.accountId}/info/iOSMobileCustomized/${urlData.id}?token=${sessionStorage.userToken}`, params)
}

// Android mobile 获取信息
export const getInfoAndroidMobile = (params) => {
  return api.get(`/v1/admin/accounts/${params.accountId}/info/androidMobileCustomized`, params, true)
}

// Android mobile 修改信息
export const updateInfoAndroidMobile = (params, urlData) => {
  return api.putJson(`/v1/admin/accounts/${urlData.accountId}/info/androidMobileCustomized/${urlData.id}?token=${sessionStorage.userToken}`, params)
}

// PC client 获取信息
export const getInfoPCClient = (params) => {
  return api.get(`/v1/admin/accounts/${params.accountId}/info/desktopCustomized`, params, true)
}

// PC client 修改信息
export const updateInfoPCClient = (params, urlData) => {
  return api.putJson(`/v1/admin/accounts/${urlData.accountId}/info/desktopCustomized/${urlData.id}`, params)
}

// 文件上传接口
export const uploadFile = (requestParam, formData) => {
  return api.uploadPost(`/v1/admin/common/upload?businessId=${requestParam.businessId}&businessType=customized&token=${sessionStorage.userToken}`, formData)
}

// 获取定制化信息
export const getCustomizedInfo = (params) => {
  return api.post(`/v1/admin/accounts/${params.accountId}/info`, params)
}

// 发布客户端
export const publishClient = (params) => {
  return api.post(`/v1/customization/accounts/${params.accountId}/publish`, params, true)
}
