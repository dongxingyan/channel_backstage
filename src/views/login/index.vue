<template>
  <div class="login">
    <div class="container">
      <div class="logo-box">
        <img src="../../assets/image/logo.png">
      </div>
      <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="rules">
        <div class="login-form-header">
          {{$t("CHANNEL_BACKSTAGE_NAME")}}
        </div>
        <el-form-item class="login-form-input" prop="userName">
          <img class="input-img" src="../../assets/image/input-user.png">
          <el-input type="text" v-model="loginForm.userName" :placeholder="$t('CHANNEL_USERNAME')" @keyup.enter.native="login('loginForm')"></el-input>
        </el-form-item>
        <el-form-item class="login-form-input" prop="password">
          <img class="input-img" src="../../assets/image/input-pass.png">
          <el-input type="password" v-model="loginForm.password" :placeholder="$t('CHANNEL_PASSWORD')" @keyup.enter.native="login('loginForm')"></el-input>
        </el-form-item>
        <el-form-item class="login-form-input check-code-input" prop="code">
          <img class="input-img" src="../../assets/image/input-check.png">
          <el-input type="text" v-model="loginForm.code" :placeholder="$t('CHANNEL_VERIFICATION_CODE')" @keyup.enter.native="login('loginForm')"></el-input>
          <img class="check-img" :src="codeImageUrl" :alt="$t('CHANNEL_VERIFICATION_CODE')" @click="changeCodeImage">
          <div class="error-tip" v-show="checkFailTip.isShow" v-text="checkFailTip.message"></div>
        </el-form-item>
        <div class="btn-container">
          <el-button class="login-btn" :loading="loginForm.loginLoadingShow" type="primary" @click="login('loginForm')">{{$t('CHANNEL_LOGIN')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import api from 'api/index'
  import jquery from 'jquery'
  import { apiServer } from 'configuration/index'
//  import { USER_PASS_NOT_EXIT, VERIFICATION_CODE_ERROR } from 'configuration/global-const'

  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          userName: '',
          password: '',
          code: '',
          timestamp: new Date().getTime(),
          loginLoadingShow: false
        },
        checkFailTip: {
          isShow: false,
          message: ''
        },
        rules: {
          userName: [
            {required: true, message: this.$t('CHANNEL_INPUT_USERNAME'), trigger: 'blur'}
          ],
          password: [
            {required: true, message: this.$t('CHANNEL_INPUT_PASSWORD'), trigger: 'blur'}
          ],
          code: [
            {required: true, message: this.$t('CHANNEL_INPUT_VERIFICATION'), trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.$nextTick(function() {
        // classList 刚好兼容ie10
        Array.from(document.querySelectorAll('.login-form-input')).forEach((ele) => {
          ele.addEventListener('focusin', function() {
            this.classList.toggle('focus-color')
          })
          ele.addEventListener('focusout', function() {
            this.classList.toggle('focus-color')
          })
        })
      })
    },
    computed: {
      codeImageUrl() {
        return `${apiServer}/cloudpServer/getCaptchaImage?timestamp=${this.loginForm.timestamp}`
      }
    },
    methods: {
      // 登录
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.checkVerificationCode()
          } else {
            return false
          }
        })
      },
      // 校验验证码
      checkVerificationCode () {
        /* api.login.checkVerificationCode({
          timestamp: new Date().getTime(),
          code: this.loginForm.code
        }).then(response => {
          if (response.data === 'false') {
            this.checkUserInfo()
          } else {
            this.checkFailTip.isShow = true
            this.checkFailTip.message = VERIFICATION_CODE_ERROR
          }
        }) */
        // 目前先用这种方式进行验证码的校验 下来再进行更改
        jquery.ajax({
          crossDomain: true,
          xhrFields: {withCredentials: true},
          type: 'POST',
          url: apiServer + '/cloudpServer/checkCaptcha',
          data: {
            timestamp: '',
            code: this.loginForm.code
          },
          dataType: 'JSON',
          success: (result) => {
            if (result == true) {
              this.checkUserInfo()
            } else {
              this.checkFailTip.isShow = true
//              this.checkFailTip.message = VERIFICATION_CODE_ERROR
              this.checkFailTip.message = this.$t('VERIFICATION_CODE_ERROR')
            }
          },
          catch: (error) => {
            this.$message.error(error.toString())
          }
        })
      },
      // 验证用户信息
      checkUserInfo () {
        // 用户登录
        api.login.goToLogin({
          username: this.loginForm.userName,
          password: this.loginForm.password
        }).then(response => {
          this.loginForm.loginLoadingShow = true
          let responseData = response.data
          if (responseData.code === '0') {
            // 如果channelId不存在，则表明该账号不是渠道管理的账号
            if (!responseData.data.channelId) {
              this.loginForm.loginLoadingShow = false
              this.checkFailTip.isShow = true
//              this.checkFailTip.message = USER_PASS_NOT_EXIT
              this.checkFailTip.message = this.$t('USER_PASS_NOT_EXIT')
              return false
            }
            // 不显示错误提示框
            this.checkFailTip.isShow = false
            this.checkFailTip.message = ''
            // 把userInfo放入sessionStorage中
            sessionStorage.setItem('userToken', responseData.data.token)
            sessionStorage.setItem('channelId', responseData.data.channelId)
            sessionStorage.setItem('accountId', responseData.data.accountId)
            sessionStorage.setItem('userName', this.loginForm.userName)
            // 跳转到首页
            this.$router.push({name: 'home'})
          } else {
            this.loginForm.loginLoadingShow = false
            this.checkFailTip.isShow = true
            this.checkFailTip.message = responseData.msg
          }
        })
      },
      changeCodeImage() {
        this.loginForm.timestamp = new Date().getTime()
      }
    }
  }
</script>

<style lang="scss">
  @import "login.scss";
</style>
