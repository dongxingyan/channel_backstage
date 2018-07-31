<template lang="html">
  <div class="customization-admin">

    <el-row class="admin-header">
      <el-col class="custom-title" :span="5">客户后台管理系统</el-col>
      <el-col class="title-tip" :span="7"><img src="../../../../assets/image/tip.png"> &nbsp;保存后,立即生效</el-col>
    </el-row>

    <input type="file" id="J-input" @change="uploadChange($event)">

    <div class="form-custom">
      <div class="row-box" style="height: 72px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            系统名称
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <el-input v-model="adminForm.name"></el-input>
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            *必填
          </div>
        </div>
      </div>

      <div class="row-box" style="height: 68px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            自定义域名
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <el-input v-model="adminForm.customizedDomain"></el-input>
          </div>
        </div>
        <div class="col-box col-box-tips">
          <div class="item-content item-content-tips">
            若不需要，可置空 <br> 域名解析（cname）地址：{{defaultDomain}}
          </div>
        </div>
      </div>

      <div class="row-box" style="height:75px" v-loading="loading.loginLogo">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            登录页logo
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="adminForm.loginLogo | imageUrl" width="180px" height="35px">
          </div>
        </div>
        <div class="col-box col-box-tips">
          <div class="item-content item-content-tips">
            图片支持png格式，小于512k，200*38像素 <br>
            <el-button data-type="1" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('loginLogo')">
              上传图片
            </el-button>
          </div>
        </div>
      </div>

      <div class="row-box" style="height: 92px" v-loading="loading.ico">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            icon图标
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="adminForm.ico | imageUrl" width="50" height="50">
          </div>
        </div>
        <div class="col-box col-box-tips">
          <div class="item-content item-content-tips">
            图片支持png格式，48*48像素 <br>
            <el-button data-type="2" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('ico')">上传图片</el-button>
          </div>
        </div>
      </div>

      <div class="row-box" style="height: 88px" v-loading="loading.systemLogo">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            登陆后左上角logo
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="adminForm.systemLogo | imageUrl" width="50" height="50">
          </div>
        </div>
        <div class="col-box col-box-tips">
          <div class="item-content item-content-tips">
            图片支持png格式，小于512k，140*140像素 <br>
            <el-button data-type="3" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('systemLogo')">上传图片</el-button>
          </div>
        </div>
      </div>

      <div class="row-box" style="height: 148px" v-loading="loading.background">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            背景图
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img class="item-content-input-img" :src="adminForm.background | imageUrl" width="150" height="100">
          </div>
        </div>
        <div class="col-box col-box-tips">
          <div class="item-content item-content-tips">
            建议png格式，尺寸1920*1080，图片大小不能超过1M， <br> 中心区域380*400 会被覆盖 <br>
            <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('background')">上传图片</el-button>
          </div>
        </div>
      </div>

    </div>

    <br>
    <el-button class="btn-gradient-blue btn-save" type="text" @click="updateAdminInfo">保存</el-button>

    </div>
</template>

<script>
  import * as jquery from 'jquery'
  import global from 'utils/global-data'
  import defaultImage from 'assets/black.png'
  import api from 'api/index'
  import { apiServer } from 'configuration/index'
  import { NEED_SYSTEM_NAME, UPDATE_SUCCESS, UPLOAD_SUCCESS } from 'configuration/global-const'

  export default {
    name: 'CustomizationAdmin',
    created () {
      this.getAdminInfo()
    },
    data() {
      return {
        adminForm: {
          id: 0,
          name: '',
          customizedDomain: '',
          loginLogo: defaultImage,
          ico: defaultImage,
          systemLogo: defaultImage,
          background: defaultImage
        },
        defaultDomain: '',
        accountId: sessionStorage.getItem('accountId'),
        loading: {
          loginLogo: false,
          ico: false,
          systemLogo: false,
          background: false
        },
        uploadImageType: ''
      }
    },
    filters: {
      // 把图片的相对路径转换为绝对路径，并且没有图片时显示默认图片
      imageUrl (value) {
        if (value && value.indexOf('base64') === -1) {
          return `${apiServer}${value}`
        }
        return defaultImage
      }
    },
    methods: {
      // 获取客户后台系统信息
      getAdminInfo () {
        let requestData = {
          accountId: this.accountId
        }
        api.customized.getInfoAdminBackstage(requestData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.adminForm.id = resData.data.id
            this.adminForm.name = resData.data.name
            this.adminForm.customizedDomain = resData.data.customizedDomain
            this.adminForm.loginLogo = resData.data.loginLogo
            this.adminForm.ico = resData.data.ico
            this.adminForm.systemLogo = resData.data.systemLogo
            this.adminForm.background = resData.data.background
            this.defaultDomain = resData.data.defaultDomain
          } else {
            this.$message.error(resData.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      // 上传图片 按钮点击触发的事件
      uploadBtnClick (imageType) {
        this.uploadImageType = imageType
        this.loading.imageType = true
        jquery('#J-input').trigger('click')
      },
      // 监听上传的change事件，如果更改了把图片上传到服务器
      uploadChange (event) {
        let requestParam = {
          businessType: 'customized',
          businessId: sessionStorage.getItem('accountId')
        }
        let formData = new FormData()
        formData.append('file', event.target.files[0])

        api.customized.uploadFile(requestParam, formData).then(response => {
          this.loading.imageType = false
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success(UPLOAD_SUCCESS)
            this.adminForm[this.uploadImageType] = resData.data.filePath
          } else {
            this.$message.error(resData.msg)
          }
        }).catch(error => {
          this.loading.imageType = false
          this.$message.error(error.toString())
        })
      },
      // 修改客户后台定制化信息
      updateAdminInfo () {
        let requestData = this.adminForm
        let urlData = {
          accountId: this.accountId,
          id: this.adminForm.id
        }
        // 检查系统名称是否填写
        if (!this.adminForm.name) {
          this.$message.error(NEED_SYSTEM_NAME)
          return false
        }
        // 如果用户输入的自定义域名中包含大写字母，把它转换为小写
        if (requestData.customizedDomain) {
          requestData.customizedDomain = requestData.customizedDomain.toLowerCase()
        }
        // 调用修改接口
        api.customized.updateInfoAdminBackstage(requestData, urlData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success(UPDATE_SUCCESS)
            this.getAdminInfo()
          } else {
            this.$message.error(resData.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
