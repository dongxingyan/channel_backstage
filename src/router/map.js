import name from './name'

export default [
  // 登录页面
  {
    path: '/',
    redirect: '/login'
  },
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component: () => import('views/login')
  },
  // 主页面
  {
    path: '/main',
    component: () => import('views/main-box'),
    children: name.mainPageArray
  },
  // 404页面
  {
    path: '*',
    name: '404页面',
    component: () => import('components/NotFound.vue')
  }
]
