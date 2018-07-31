<template lang="html">
  <div class="customization-meeting">

    <el-row class="admin-header">
      <el-col class="custom-title" :span="5">web浏览器端</el-col>
      <el-col class="title-tip" :span="7"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;保存后,立即生效</el-col>
    </el-row>

    <input type="file" id="J-meeting-input" @change="uploadChange($event)">

    <div class="form-custom">
      <div class="row-box" style="height:76px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            系统名称
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <el-input v-model="meetingForm.name"></el-input>
          </div>
        </div>
        <div class="col-box col-box-tips " >
          <div class="item-content item-content-tips">
            *必填
          </div>
        </div>
      </div>

      <div class="row-box" style="height:70px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            自定义域名
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <el-input v-model="meetingForm.customizedDomain"></el-input>
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            若不需要，可置空 <br> 域名解析（cname）地址：{{defaultDomain}}
          </div>
        </div>
      </div>

      <div class="row-box" style="height:64px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            HTTPS证书
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <el-button v-show="!meetingForm.certificateUrl" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('certificateUrl')">上传https证书</el-button>
            <el-button v-show="meetingForm.certificateUrl" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('certificateUrl')">更新https证书</el-button>
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            <img src="../../../../assets/image/tip.png" alt=""> 若使用自定义域名，请上传https证书
          </div>
        </div>
      </div>

      <div class="row-box" style="height:74px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            登录页logo
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="meetingForm.loginLogo | imageUrl" alt="" width="180px" height="35px">
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            图片支持png格式，小于512k，380*128像素 <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('loginLogo')">上传图片</el-button>
          </div>
        </div>
      </div>

      <div class="row-box" style="height:90px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            icon图标
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="meetingForm.ico | imageUrl" alt="" width="50px" height="50px">
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            图片支持png格式，48*48像素 <br>
            <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('ico')">上传图片</el-button>
          </div>
        </div>
      </div>

      <div class="row-box" style="height:90px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            登陆后左上角logo
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="meetingForm.systemLogo | imageUrl" alt="" width="50px" height="50px">
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            图片支持png格式，小于512k，40*40像素 <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('systemLogo')">上传图片</el-button>
          </div>
        </div>
      </div>

      <div class="row-box" style="height:148px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            背景图
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img class="item-content-input-img" :src="meetingForm.background | imageUrl" alt="" width="150px" height="100px">
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            建议png格式，尺寸1920*1080，图片大小不能超过1M， <br> 中心区域380*400 会被覆盖 <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('background')">上传图片</el-button>
          </div>
        </div>
      </div>
    </div>

    <br>
    <el-button class="btn-gradient-blue btn-save" type="text" @click="updateMeetingInfo">保存</el-button>

  </div>

</template>

<script>
  import * as jquery from 'jquery'
  import global from 'utils/global-data'
  import defaultImage from 'assets/black.png'
  import api from 'api/index'
  import { apiServer } from 'configuration/index'
  import { NEED_SYSTEM_NAME, UPDATE_SUCCESS } from 'configuration/global-const'

  export default {
    name: 'CustomizationMeeting',
    created () {
      this.getMeetingInfo()
    },
    data() {
      return {
        meetingForm: {
          id: 0,
          name: '',
          customizedDomain: '',
          loginLogo: defaultImage,
          background: defaultImage,
          systemLogo: defaultImage,
          ico: defaultImage,
          certificateUrl: ''
        },
        defaultDomain: '',
        accountId: sessionStorage.getItem('accountId'),
        uploadImageType: ''
      }
    },
    filters: {
      imageUrl (value) {
        if (value && value.indexOf('base64') === -1) {
          return `${apiServer}${value}`
        }
        return defaultImage
      }
    },
    methods: {
      // 获取meeting系统信息
      getMeetingInfo () {
        let requestData = {
          accountId: this.accountId
        }
        api.customized.getInfoOfMeeting(requestData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.meetingForm.id = resData.data.id
            this.meetingForm.name = resData.data.name
            this.meetingForm.customizedDomain = resData.data.customizedDomain
            this.meetingForm.loginLogo = resData.data.loginLogo
            this.meetingForm.ico = resData.data.ico
            this.meetingForm.systemLogo = resData.data.systemLogo
            this.meetingForm.background = resData.data.background
            this.meetingForm.certificateUrl = resData.data.certificateUrl
            this.defaultDomain = resData.data.defaultDomain
          } else {
            this.$message.error(resData.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      uploadBtnClick (imgaeType) {
        this.uploadImageType = imgaeType
        jquery('#J-meeting-input').trigger('click')
      },
      uploadChange (event) {
        let requestParam = {
          businessType: 'customized',
          businessId: sessionStorage.getItem('accountId')
        }
        let formData = new FormData()
        formData.append('file', event.target.files[0])

        api.customized.uploadFile(requestParam, formData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success('上传成功')
            this.meetingForm[this.uploadImageType] = resData.data.filePath
          } else {
            this.$message.error(resData.msg)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      // 修改客户后台定制化信息
      updateMeetingInfo () {
        let requestData = this.meetingForm
        let urlData = {
          accountId: this.accountId,
          id: this.meetingForm.id
        }
        // 检查系统名称是否填写
        if (!this.meetingForm.name) {
          this.$message.error(NEED_SYSTEM_NAME)
          return false
        }
        if (requestData.customizedDomain) {
          requestData.customizedDomain = requestData.customizedDomain.toLowerCase()
        }
        // 调用修改接口
        api.customized.updateInfoOfMeeting(requestData, urlData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success(UPDATE_SUCCESS)
            this.getMeetingInfo()
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
