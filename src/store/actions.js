/**
 * @describe  存放根action
 */
import Vue from 'vue'
import api from '../api/index'
import { SET_USER_INFO } from './mutationTypes'

// 设置用户信息
export const setUserInfo = ({ commit, state }, payload) => {
  commit(SET_USER_INFO, payload)
}
