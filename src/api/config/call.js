/**
 * @description Api Call
 */

export default class Call {
  constructor(executor) {
    let self = this
    executor(function (res) {
      self._dispatchResolve(res)
    }, function (errRes) {
      self._dispatchReject(errRes)
    })
  }

  then(onResolved) {
    this.resolve = onResolved
    return this
  }

  catch(onRejected) {
    this.reject = onRejected
    return this
  }

  _dispatchResolve(response) {
    if (Call._isFunc(this.resolve)) {
      this.resolve(response)
    }
  }

  _dispatchReject(error) {
    if (!error.code || error.code == 0) {
      this.reject(error)
    }
    if (!error.msg) {
      error.msg = '网络请求失败，请重试~'
    }
    if (Call._isFunc(this.reject)) {
      this.reject(error)
    }
  }

  static _isFunc(obj) {
    return obj && typeof obj === 'function'
  }
}
