/**
 * @describe 登录模块
 */
import {
  GET_VERIFICATION_CODE_IMG
} from '../mutationTypes'

const state = {
  // 验证码 图片
  verificationCodeImg: ''
};

const mutations = {
  // 获取验证码图片地址
  [GET_VERIFICATION_CODE_IMG] (state, payload) {
    state.verificationCodeImg = payload
  }
}
