/**
 * @describe  存放各种API请求
 * @example
 */
import * as changePassword from './apiList/change-password'
import * as customer from './apiList/customer'
import * as customized from './apiList/customized'
import * as home from './apiList/home'
import * as login from './apiList/login'
import * as meetingRoom from './apiList/meeting-room'
import * as statisticsLive from './apiList/statistics-live'
import * as statisticsUse from './apiList/statistics-use'
import * as teminal from './apiList/teminal'
import * as boxesManage from './apiList/hardware/boxesManage'
import * as videoConference from './apiList/hardware/videoConference'
import * as hardware from './apiList/hardware/index'
import * as apk from './apiList/hardware/apk'
import * as tofu from './apiList/hardware/tofu'
import * as firstScreen from './apiList/hardware/firstScreen'
import * as defaultScreen from './apiList/hardware/defaultScreen'

export default {
  changePassword,
  customer,
  customized,
  home,
  login,
  meetingRoom,
  statisticsLive,
  statisticsUse,
  teminal,
  boxesManage,
  videoConference,
  apk,
  hardware,
  tofu,
  firstScreen,
  defaultScreen
}
