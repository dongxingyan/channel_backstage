/**
 * @describe  存放根mutation
 *
 * @example
 */
import { SET_USER_INFO, SET_CUSTOMIZED } from './mutationTypes'

export default {
  // 设置用户信息
  [SET_USER_INFO](state, payload) {
    for (let property in payload) {
      state.userInfo[property] = payload[property]
    }
  },
  // 设置定制化导航是否显示，
  [SET_CUSTOMIZED](state, payload) {
    state.isCustomized = payload
  }
}
