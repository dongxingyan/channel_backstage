// 客户管理 创建客户成功后返回的数据
let userInfoOfCreate = {}

// 是否是OEM
let isOEM = 0
let curentLang = localStorage.getItem('lang') || window.navigator.language

// 时间插件 今天 昨天 一周前选项
export let pickerOptions = {
  shortcuts: [{
    // text: '今天',
    onClick(picker) {
      picker.$emit('pick', new Date())
    }
  }, {
    // text: '昨天',
    onClick(picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', date)
    }
  }, {
    // text: '一周前',
    onClick(picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', date)
    }
  }]
}
if (curentLang == 'zh-CN') {
  pickerOptions.shortcuts[0].text = '今天'
  pickerOptions.shortcuts[1].text = '昨天'
  pickerOptions.shortcuts[2].text = '一周前'
} else {
  pickerOptions.shortcuts[0].text = 'today'
  pickerOptions.shortcuts[1].text = 'yesterday'
  pickerOptions.shortcuts[2].text = 'weekday'
}

// 判断token是否存在
let isExitUserInfo = (event) => {
  let userToken = sessionStorage.userToken
  let channelId = sessionStorage.getItem('channelId')
  let accountId = sessionStorage.getItem('accountId')
  if (!userToken || !channelId || !accountId) {
    const h = event.$createElement

    // event.$notify({
    //   title: '提示',
    //   message: h('i', '用户信息已失效，请重新登录')
    // })
    event.$router.push({
      name: 'login'
    })
    return false
  }
}

export default {
  userInfoOfCreate,
  isOEM,
  pickerOptions,
  isExitUserInfo
}
