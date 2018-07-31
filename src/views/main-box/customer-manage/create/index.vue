<template lang="html">
  <div class="customer-create">
    <div class="header">
      <span class="header-title">{{$t('CHANNEL_HOME_MANAGEMENT_NEW')}}</span>
    </div>

    <el-row class="row-box">
      <el-col :span="16" :lg="{span: 16}" :xl="{span: 12}">
        <el-form :model="form" ref="form" :rules="rules" label-width="200px">
          <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_CorporateName')" prop="organName">
            <el-input v-model="form.organName" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_CorporateNameTip')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_Linkman')" prop="contact">
            <el-input v-model="form.contact" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_LinkmanTip')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_Contact')" prop="mobile">
            <el-input v-model="form.mobile" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_ContactTip')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_E-mail')" prop="email">
            <el-input v-model="form.email" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_E-mailTip')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_Remarks')" prop="remark">
            <el-input type="textarea" v-model="form.remark" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_RemarksTip')"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="createSave('form')">{{$t('CHANNEL_HOME_MANAGEMENT_SAVE')}}</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="createCancel">{{$t('CHANNEL_HOME_MANAGEMENT_CANCEL')}}</el-button>
    </div>
  </div>
</template>

<script>
  import api from 'api/index'
  import utils from 'utils/global-data'

  export default {
    name: 'CustomerCreate',
    created () {
      window.self = this
    },
    data() {
      let validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('CHANNEL_CUSTOMER_NAME_ERROR')))
        } else {
          callback()
        }
      }
      let rules = {
        organName: [
          {required: true, validator: validateName, trigger: 'blur'}
        ]
      }
      return {
        form: {
          organName: null,
          contact: null,
          mobile: null,
          email: null,
          remark: null
        },
        rules: rules
      }
    },
    methods: {
      // 创建客户
      createSave(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.apiOfCreateCustomer(response => {
              utils.userInfoOfCreate = response
              // 跳转到创建成功页面
              this.$router.push({name: 'createSucceed'})
            })
          }
        })
      },
      // 调用创建客户接口
      apiOfCreateCustomer(callback) {
        let formKeys = Object.keys(this.form)
        let requestData = {}
        // 对参数做处理 如果为空则不传
        formKeys.forEach(item => {
          let value = this.form[item]
          if (value) {
            requestData[item] = value
          }
        })

        if (requestData.organName) {
          requestData.organName = requestData.organName.replace(/(^\s*)|(\s*$)/g, '')
          if (requestData.organName.length == 0) {
            this.$message.warning(this.$t('CUSTORM_NAME_ERROR'))
            return
          }
        }
        requestData.channelId = sessionStorage.getItem('channelId')

        api.customer.createCustomer(requestData).then(response => {
          let resData = response.data

          if (resData.code === '0') {
            callback(resData.data)
          } else if (resData.code === '999') {
            this.$message.error(this.$t('CHANNEL_SERVER_ERROR'))
          } else {
            this.$message.error(response.data.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      createCancel() {
        this.$router.go(-1)
      },
      commonClearValidate(formName) {
        this.$refs[formName].clearValidate()
      }
    }
  }
  window.vueEvent.$on('reloadRouter', function() {
    if (window.self.commonClearValidate) {
      window.self.commonClearValidate('form')
    }
  })
</script>

<style lang="scss">
  @import "index.scss";
</style>
