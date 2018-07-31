/**
 * @description 网络请求框架封装
 */

import Axios from 'axios'
import QS from 'querystring'
import Call from './call'
import { apiServer } from 'configuration/index'

Axios.defaults.baseURL = '/cloudpServer'

// TODO 设置超时时间
Axios.defaults.timeout = 10000

Axios.defaults.headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
}

// TODO http code 校验
Axios.defaults.validateStatus = function (status) {
  return status
}

// TODO GET 请求 params 序列化
Axios.defaults.paramsSerializer = function (params) {
  return QS.stringify(params)
}

// TODO 设置POST等请求 body 序列化
Axios.defaults.transformRequest = [function (body) {
  let data = body || {}

  if (body instanceof window.FormData) {
    return body
  }
  return JSON.stringify(data)
}]

// TODO 设置统一请求拦截
Axios.interceptors.request.use(config => {
  let url = config.url
  if (url.indexOf('?') === -1) {
    config.url = `${url}?_${new Date().getTime()}`
  } else {
    config.url = `${url}&_${new Date().getTime()}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// TODO 设置统一响应拦截
/* Axios.interceptors.response.use(response => {
  if (response.data.code == -1 && storage.get('unionId')) {
    router.push({name: '登录'})
  }
  if (response.data.code != 0) {
    return Promise.resolve(response.data)
  }
  // account.interceptHttpCode(response.data.code)

  return Promise.reject(response.data)
}, error => {
  return Promise.reject(error)
}) */

/**
 * @description 统一 GET 请求
 * @param url
 * @param params --> GET 请求参数（***?name=walid&age=25）
 */
function get(url, params) {
  params.token = sessionStorage.getItem('userToken')
  return new Call((resolve, reject) => {
    Axios.get(url, {params: params})
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 统一 POST 请求
 * @param url
 * @param body --> POST 请求 data
 */
function post(url, body, isNeedTimeout) {
  if (sessionStorage.getItem('userToken')) {
    body.token = sessionStorage.getItem('userToken')
  }
  if (body) {
    url = `${url}?${QS.stringify(body)}`
  }
  let config = {}
  if (isNeedTimeout) {
    config.timeout = 1000 * 600
  }
  return new Call((resolve, reject) => {
    Axios.post(url, body, config)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 专为上传文件的 POST 请求
 * @param url
 * @param body --> POST 请求 data
 */
function uploadPost(url, body) {
  return new Call((resolve, reject) => {
    Axios.post(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 统一 PUT 请求
 * @param url
 * @param body --> PUT 请求 data
 */
function put(url, body) {
  body.token = sessionStorage.getItem('userToken')

  url = `${url}?${QS.stringify(body)}`

  return new Call((resolve, reject) => {
    Axios.put(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 现在专门为修改客户写一个put方法，以后再做相应的改动
 * @param url
 * @param body --> PUT 请求 data
 */
function putUpdCustomer(url, body) {
  url = `${url}?token=${sessionStorage.getItem('userToken')}`

  return new Call((resolve, reject) => {
    Axios.put(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * @description 统一 DELETE 请求
 * @param url
 * @param params --> DELETE 请求参数
 */
function deleteMethod(url, params) {
  params.token = sessionStorage.getItem('userToken')
  return new Call((resolve, reject) => {
    Axios.delete(url, {params: params})
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/*
  针对 josn格式的 put
*/
function putJson(url, body) {
  let token = sessionStorage.getItem('userToken')
  let sign = url.includes('?') ? '&' : '?'
  url = `${url}${sign}token=${token}`
  return new Call((resolve, reject) => {
    Axios.put(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/*
  针对 josn格式的 post
*/
function postJson(url, body, option) {
  let token = sessionStorage.getItem('userToken')
  let sign = url.includes('?') ? '&' : '?'
  url = `${url}${sign}token=${token}`
  return new Call((resolve, reject) => {
    Axios.post(url, body)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  get,
  post,
  uploadPost,
  put,
  delete: deleteMethod,
  putJson,
  postJson,
  putUpdCustomer
}
