/* 首屏豆腐块接口 */
import api from '../../config'

// 首屏豆腐块列表接口
export const queryScreenTofus = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubeScreens`, params)
}

// 首屏豆腐块编辑接口
export const editScreenList = (body) => {
  return api.postJson(`/v1/admin/accounts/${sessionStorage.accountId}/beanCurdCubeScreens`, body)
}

// 根据所编辑的不同 account 查询对应豆腐块
export const queryValidTofus = (params = {}) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/allBeanCurdCubes`, params)
}
