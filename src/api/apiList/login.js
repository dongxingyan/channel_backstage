import api from '../config'

// 校验 验证码
export const checkVerificationCode = (params) => {
  return api.post(`checkCaptcha`, params)
}

// 用户登录
export const goToLogin = (params) => {
  return api.post(`v1/user/login`, params)
}
