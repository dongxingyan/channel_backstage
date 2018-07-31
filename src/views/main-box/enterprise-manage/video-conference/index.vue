<template lang="html">
<div class="video-conference">
  <el-row class="admin-header">
    <el-col class="custom-title" :span="5">企业视讯</el-col>
    <el-col class="title-tip" :span="7"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;保存后,立即生效</el-col>
  </el-row>

  <div class="form-custom">
    <div class="row-box" style="height:80px">
      <div class="col-box col-box-label">
        <div class="item-content item-content-label">
          LOGO
        </div>
      </div>
      <div class="col-box col-box-input">
        <div class="item-content item-content-input">
          <img :src="videoForm.backgroundLogo | imageUrl" alt="" width="40" height="40">
        </div>
      </div>
      <div class="col-box col-box-tips" >
        <div class="item-content item-content-tips">
          图片支持png格式，70*70像素，大小不能超过5M <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('backgroundLogo')">上传图片</el-button>
        </div>
      </div>
    </div>

    <div class="row-box" style="height:106px">
      <div class="col-box col-box-label">
        <div class="item-content item-content-label">
          启动等待图
        </div>
      </div>
      <div class="col-box col-box-input">
        <div class="item-content item-content-input">
          <img :src="videoForm.startPageUrl | imageUrl" alt="" width="125" height="71">
        </div>
      </div>
      <div class="col-box col-box-tips" >
        <div class="item-content item-content-tips">
          图片支持png格式，1920*1080像素，大小不能超过5M <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('startPageUrl')">上传图片</el-button>
        </div>
      </div>
    </div>

    <div class="row-box" style="height:106px">
      <div class="col-box col-box-label">
        <div class="item-content item-content-label">
          默认背景图
        </div>
      </div>
      <div class="col-box col-box-input">
        <div class="item-content item-content-input">
          <img :src="videoForm.backgroundUrl | imageUrl" alt="" width="125" height="71">
        </div>
      </div>
      <div class="col-box col-box-tips" >
        <div class="item-content item-content-tips">
          图片支持png格式，1920*1080像素，大小不能超过5M <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('backgroundUrl')">上传图片</el-button>
        </div>
      </div>
    </div>

    <div class="row-box" style="height:138px">
      <div class="col-box col-box-label">
        <div class="item-content item-content-label">
          呼叫页左侧图
        </div>
      </div>
      <div class="col-box col-box-input">
        <div class="item-content item-content-input">
          <img :src="videoForm.leftCallUrl | imageUrl" alt="" width="80" height="100">
        </div>
      </div>
      <div class="col-box col-box-tips" >
        <div class="item-content item-content-tips">
          图片支持png格式，701*909像素，大小不能超过5M <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('leftCallUrl')">上传图片</el-button>
        </div>
      </div>
    </div>
  </div>

  <br>
  <el-button class="btn-gradient-blue btn-save" type="text" @click="updateVideoInfo">保存</el-button>

  <input type="file" id="J-meeting-input" @change="uploadChange($event)">
</div>
</template>

<script>
import api from 'api/index'
import defaultImage from 'assets/black.png'
import {
  apiServer
} from 'configuration/index'
import {
  NEED_SYSTEM_NAME,
  UPDATE_SUCCESS
} from 'configuration/global-const'

export default {
  name: 'videoConference',
  created() {
    this.getVideoConferenceInfo()
  },
  data() {
    return {
      videoForm: {
        id: '',
        backgroundUrl: defaultImage,
        backgroundLogo: defaultImage,
        startPageUrl: defaultImage,
        leftCallUrl: defaultImage
      }
    }
  },
  filters: {
    imageUrl(value) {
      if (value && value.indexOf('base64') === -1) {
        return `${apiServer}${value}`
      }
      return defaultImage
    }
  },
  methods: {
    // 获取视频会议信息
    getVideoConferenceInfo() {
      api.videoConference.getInfoVideoConference({})
        .then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.videoForm.id = resData.data.id
            this.videoForm.backgroundUrl = resData.data.backgroundUrl
            this.videoForm.backgroundLogo = resData.data.backgroundLogo
            this.videoForm.startPageUrl = resData.data.startPageUrl
            this.videoForm.leftCallUrl = resData.data.leftCallUrl
          } else {
            this.$message.error(resData.message)
          }
        })
        .catch(error => {
          this.$message.error(error.toString())
        })
    },
    // 修改视频会议信息
    updateVideoInfo() {
      let requestData = this.videoForm
      let urlData = {
        id: this.videoForm.id
      }
      // 调用修改接口
      api.videoConference.updateVideoConference(requestData, urlData)
        .then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success(UPDATE_SUCCESS)
            this.getVideoConferenceInfo()
          } else {
            this.$message.error(resData.message)
          }
        })
        .catch(error => {
          this.$message.error(error.toString())
        })
    },
    uploadBtnClick(imgaeType) {
      this.uploadImageType = imgaeType
      document.querySelector('#J-meeting-input').click()
    },
    uploadChange(event) {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      api.videoConference.uploadFile(formData)
        .then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success('上传成功')
            this.videoForm[this.uploadImageType] = resData.data.filePath
          } else {
            this.$message.error(resData.msg)
          }
        })
        .catch(error => {
          this.$message.error(error.toString())
        })
    }
  }
}
</script>

<style lang="scss">
@import 'index'
</style>
