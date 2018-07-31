/* 硬件通用接口 */
import api from '../../config'
// 查询所有所属分组，渠道，机构接口,type：1所属分组，2渠道，3机构
export const queryGroup = (params) => {
  return api.get(`/v1/admin/accounts/${sessionStorage.accountId}/accountNames`, params)
}
