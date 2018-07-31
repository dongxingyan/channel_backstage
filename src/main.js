// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import 'assets/css/style.scss'
import router from './router'
import store from './store'
import api from './api'
import fastclick from 'fastclick'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'

let currentLang
if (localStorage.getItem('lang')) {
  currentLang = localStorage.getItem('lang')
} else {
  localStorage.setItem('lang', window.navigator.language)
  currentLang = window.navigator.language
}
if (currentLang == 'zh-CN') {
  Vue.use(ElementUI)
  document.title = '渠道管理系统'
} else {
  Vue.use(ElementUI, {locale})
  document.title = 'Channel management system'
}
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: currentLang,
  messages: {
    'zh-CN': require('./language/cn-cn.json'),   // 中文语言包
    'en-US': require('./language/en-us.json')    // 英文语言包
  }
})

Vue.prototype.api = api

window.vueEvent = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  ElementUI,
  template: '<App/>',
  components: {
    App
  }
})
fastclick.attach(document.body)
