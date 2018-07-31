<template lang="html">
  <div class="change-password">
    <div class="header">
      <span class="header-title">{{$t("CHANNEL_CHANGE_PASSWORD")}}</span>
    </div>

    <el-form class="form-box" :model="form" :rules="rules" ref="passwordForm">
      <el-form-item prop="oldPassword">
        <el-row class="form-row" :gutter="20">
          <el-col class="form-row-label" :span="4">{{$t("CHANNEL_OLD_PASSWORD")}}</el-col>
          <el-col :span="4">
            <el-input v-model="form.oldPassword"></el-input>
          </el-col>
          <el-col :span="10" :offset="2">
            <span v-show="oldPassError" class="old-pass-error">{{$t("CHANNEL_OLD_PASSWORD_ERROR")}}</span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="newPassword">
        <el-row class="form-row" :gutter="20">
          <el-col class="form-row-label" :span="4">{{$t("CHANNEL_NEW_PASSWORD")}}</el-col>
          <el-col :span="4">
            <el-input v-model="form.newPassword"></el-input>
          </el-col>
          <el-col :span="10" :offset="2">

            <span class="warn-tilte" style="margin-left:80px">{{$t("CHANNEL_PASSWORD_LIMIT")}}</span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="checkPassword">
        <el-row class="form-row" :gutter="20">
          <el-col class="form-row-label" :span="4">{{$t("CHANNEL_PASSWORD_CONFIRM")}}</el-col>
          <el-col :span="4">
            <el-input v-model="form.checkPassword"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-button class="btn-gradient-blue btn-save" type="text" @click="savePassword('passwordForm')">{{$t("CHANNEL_SAVE")}}</el-button>

  </div>
</template>

<script>
  import global from '../../../utils/global-data'
  import api from 'api/index'
  export default {
    name: 'ChangePassword',
    created() {
      window.self = this
    },
    data() {
      let validateSecPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('CHANNEL_ENTER_CONFIRM_PASSWORD')))
        } else if (value !== this.form.newPassword) {
          callback(new Error(this.$t('CHANNEL_ENTER_PASSWORD_NOTSOME')))
        } else {
          callback()
        }
      }
      // 正则验证 6-18位，字母、数字或特殊字符
      let patt = /^[^\u4e00-\u9fa5]{6,18}$/
      let validateNewPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('CHANNEL_ENTER_NEW_PASSWORD')))
        }
        if (patt.test(value)) {
          callback()
        } else {
          callback(new Error(this.$t('CHANNEL_ENTER_WRONGTYPE_PASSWORD')))
        }
      }
      let validateOldPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('CHANNEL_ENTER_OLD_PASSWORD')))
        } else {
          callback()
        }
      }
      let rules = {
        oldPassword: [{
          required: true,
//          message: this.$t('CHANNEL_ENTER_OLD_PASSWORD'),
          validator: validateOldPass
        }],
        newPassword: [{
          required: true,
          validator: validateNewPass
        }],
        checkPassword: [{
          required: true,
          validator: validateSecPass
        }]
      }

      return {
        form: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: rules,
        oldPassError: false,
        newPassTipShow: true
      }
    },
    methods: {
      savePassword(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changePassword()
          }
        })
      },
      changePassword() {
        api.changePassword.alterPassword({
          channelId: sessionStorage.channelId,
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword
        }).then(res => {
          //  code：[0 |11|999]  msg：[成功|密码错误|服务器内部错误]
          if (res.data.code === '0') {
            this.oldPassError = false
            // ok
            this.$message({
              message: this.$t('CHANNEL_MODIFY_SUCCESS'),
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 3000)
          } else {
            if (res.data.code === '11') {
              this.oldPassError = true
              this.$message({
                type: 'error',
                message: this.$t('CHANNEL_OLD_PASSWORD_ERROR')
              })
            } else {
              this.$message({
                type: 'error',
                message: this.$t('CHANNEL_SERVER_ERROR')
              })
            }
          }
        })
      },
      commonClearValidate(formName) {
        this.$refs[formName].clearValidate()
      }
    }
  }
  window.vueEvent.$on('reloadRouter', function() {
    if (window.self.commonClearValidate) {
      window.self.commonClearValidate('passwordForm')
    }
  })
</script>

<style lang="scss">
  @import "index.scss";
</style>
