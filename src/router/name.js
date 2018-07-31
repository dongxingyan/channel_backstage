/**
 * @description main-box下面对应的页面配置
 */

let mainPageArray = [
  // 首页
  {
    path: 'home',
    name: 'home',
    meta: {
      routeMenu: 'home'
    },
    component: () => import('views/main-box/home')
  },
  // 实时会议信息
  {
    path: 'home/meeting-detail/:meetingRoomNum/:locked/:guestsMuted/:conferenceDuration',
    name: 'meeting-detail',
    meta: {
      routeMenu: 'meeting-detail'
    },
    component: () => import('views/main-box/home/meeting-detail')
  },
  // 参会者详情
  {
    path: 'home/participant-detail/:id/:meetingRoomNum/:participantName/:connectTime/:participantDuration/:systemLocation/:signallingNode/:mediaNode/:role/:presenting/:muted/:protocol/:bandwidth/:vendor/:remoteAddress/:remotePort/:callQuality',
    name: 'participant-detail',
    meta: {
      routeMenu: 'participant-detail'
    },
    component: () => import('views/main-box/home/participant-detail')
  },
  // 客户管理
  {
    path: 'customer',
    name: 'customer',
    meta: {
      routeMenu: 'customer'
    },
    component: () => import('views/main-box/customer-manage')
  },
  // 新建客户
  {
    path: 'customer/create',
    name: 'createCustomer',
    meta: {
      routeMenu: 'customer'
    },
    component: () => import('views/main-box/customer-manage/create')
  },
  // 新建客户成功
  {
    path: 'customer/createSucceed',
    name: 'createSucceed',
    meta: {
      routeMenu: 'customer'
    },
    component: () => import('views/main-box/customer-manage/create-succeed')
  },
  // 会议室管理
  {
    path: 'conference',
    name: 'conference',
    meta: {
      routeMenu: 'conference'
    },
    component: () => import('views/main-box/meeting-manage')
  },
  // 终端帐号
  {
    path: 'terminal',
    name: 'terminal',
    meta: {
      routeMenu: 'terminal'
    },
    component: () => import('views/main-box/terminal-account')
  },
  // 使用统计
  {
    path: 'statistics/use',
    name: 'use',
    meta: {
      routeMenu: 'statistics'
    },
    component: () => import('views/main-box/statistics/use')
  },
  // 直播统计
  {
    path: 'statistics/live',
    name: 'live',
    meta: {
      routeMenu: 'statistics'
    },
    component: () => import('views/main-box/statistics/live')
  },
  // 门户界面
  // 客户后台系统
  // {
  //   path: 'customization/admin',
  //   name: 'admin',
  //   meta: {
  //     routeMenu: 'customization'
  //   },
  //   component: () => import('views/main-box/customization/admin')
  // },
  // // meeting浏览器端
  // {
  //   path: 'customization/meeting',
  //   name: 'meeting',
  //   meta: {
  //     routeMenu: 'customization'
  //   },
  //   component: () => import('views/main-box/customization/meeting')
  // },
  // // iOS客户端
  // {
  //   path: 'customization/ios',
  //   name: 'ios',
  //   meta: {
  //     routeMenu: 'customization'
  //   },
  //   component: () => import('views/main-box/customization/ios')
  // },
  // // android客户端
  // {
  //   path: 'customization/android',
  //   name: 'android',
  //   meta: {
  //     routeMenu: 'customization'
  //   },
  //   component: () => import('views/main-box/customization/android')
  // },
  // // PC客户端
  // {
  //   path: 'customization/pc',
  //   name: 'pc',
  //   meta: {
  //     routeMenu: 'customization'
  //   },
  //   component: () => import('views/main-box/customization/pc')
  // },
  // 修改密码
  {
    path: 'password',
    name: 'changePassword',
    component: () => import('views/main-box/change-password')
  }
  // 硬件界面
  // 硬件管理
  // {
  //   path: 'enterprise/boxes',
  //   name: 'boxes',
  //   meta: {
  //     routeMenu: 'enterprise'
  //   },
  //   component: () => import('views/main-box/enterprise-manage/boxes')
  // },
  // // 定制apk管理
  // {
  //   path: 'enterprise/apk',
  //   name: 'apk',
  //   meta: {
  //     routeMenu: 'enterprise'
  //   },
  //   component: () => import('views/main-box/enterprise-manage/apk')
  // },
  // // 豆腐块管理
  // {
  //   path: 'enterprise/tofu',
  //   name: 'tofu',
  //   meta: {
  //     routeMenu: 'enterprise'
  //   },
  //   component: () => import('views/main-box/enterprise-manage/tofu')
  // },
  // // 首屏管理
  // {
  //   path: 'enterprise/screen',
  //   name: 'screen',
  //   meta: {
  //     routeMenu: 'enterprise'
  //   },
  //   component: () => import('views/main-box/enterprise-manage/screen')
  // },
  // // 默认首屏管理
  // {
  //   path: 'enterprise/defaultScreen',
  //   name: 'defaultScreen',
  //   meta: {
  //     routeMenu: 'enterprise'
  //   },
  //   component: () => import('views/main-box/enterprise-manage/default-screen')
  // },
  // // 企业视讯
  // {
  //   path: 'enterprise/videoConference',
  //   name: 'videoConference',
  //   meta: {
  //     routeMenu: 'enterprise'
  //   },
  //   component: () => import('views/main-box/enterprise-manage/video-conference')
  // }
]

export default {
  mainPageArray
}
