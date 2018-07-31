import api from '../../config'

// 获取视频会议 信息
export const getInfoVideoConference = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/info/conferenceCustomized`, params)
}

// 修改视频会议信息
export const updateVideoConference = (body, urlParams) => {
  return api.putJson(`/v1/admin/accounts/${sessionStorage.accountId}/info/conferenceCustomized/${urlParams.id}`, body)
}

// 文件上传接口
export const uploadFile = (formData) => {
  return api.uploadPost(`/v1/admin/common/upload?businessId=${sessionStorage.accountId}&businessType=vedioConference&token=${sessionStorage.userToken}`, formData)
}
