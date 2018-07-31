<template lang="html">
  <div class="customization-pc">
    <el-row>
      <el-col class="custom-title" :span="5">PC客户端</el-col>
      <el-col class="title-tip" :span="7"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;发布制作的app，安装后可见效果</el-col>
      <el-col v-if="isHasNewVersion" class="title-tip title-tip-new" :span="5"><img src="../../../../assets/image/new-tip.png" alt=""> &nbsp;有新版本请重新打包</el-col>
    </el-row>

    <input type="file" id="J-pc-input" @change="uploadChange($event)">

    <h4>安装包信息</h4>
    <el-row class="package-info" v-show="!isShowPackageInfo" v-loading="isPublish" element-loading-text="正在发布中……">
      <el-col >暂未生成版本包</el-col>
    </el-row>
    <el-row class="package-info" v-show="isShowPackageInfo" v-loading="isPublish" element-loading-text="正在发布中……">
      <el-col :span="5">
        应用名称：{{pcForm.packAppName}}
      </el-col>
      <el-col :span="7">
        版本：{{pcForm.version}}
      </el-col>
      <el-col :span="7">
        包名：{{pcForm.packName}}
      </el-col>
      <el-col :span="5">
        <img src="../../../../assets/image/windows.png" alt="">
        <a v-loading="windowsStatus" :class="{'forbid-click': windowsStatus}" class="package-info-a" :href="pcForm.windowsUrl | downloadUrl">下载</a>
        <img src="../../../../assets/image/apple.png" alt="">
        <a v-loading="macStatus" :class="{'forbid-click': macStatus}" class="package-info-a" :href="pcForm.macUrl | downloadUrl">下载</a>
      </el-col>
    </el-row>

    <el-row class="app-made">
      <el-col :span="5" style="font-weight:bold;">客户端制作</el-col>
      <el-col class="title-tip" :span="6"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;代码版本{{systemVersion}}</el-col>
    </el-row>

    <!-- form -->

    <div class="form-custom">
      <el-row style="height:72px;" :gutter="5">
        <el-col :span="5">
          应用名称
        </el-col>
        <el-col :span="5">
          <el-input v-model="updateForm.appName" :maxlength="30"></el-input>
        </el-col>
      </el-row>

      <el-row style="height:140px;" :gutter="5">
        <el-col :span="5">
          安装包名称
        </el-col>
        <el-col :span="5">
          <el-input v-model="updateForm.installPackName"></el-input>
        </el-col>
        <el-col :span="8" :offset="2">
          仅支持英文字母
        </el-col>
      </el-row>

      <el-row style="height:92px;" :gutter="5">
        <el-col :span="5">
          桌面图标
        </el-col>
        <el-col :span="7">
          <img class="item-content-input-img" :src="updateForm.iconUrl | imageUrl" alt="" width="50px" height="50px">
        </el-col>
        <el-col :span="8">
          建议PNG格式，尺寸256*256，图片大小不超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('iconUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:174px;" :gutter="5">
        <el-col :span="5">
          首页背景图
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.indexImageUrl | imageUrl" alt="" width="74px" height="133px">
        </el-col>
        <el-col :span="8">
          建议png格式，尺寸360*640，图片大小不能超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('indexImageUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:90px;" :gutter="5">
        <el-col :span="5">
          首页LOGO
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.logoUrl | imageUrl" alt="" width="70px" height="70px">
        </el-col>
        <el-col :span="8">
          建议PNG格式，尺寸140*140，图片大小不超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('logoUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:138px;" :gutter="5">
        <el-col :span="5">
          背景图
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.backgroundUrl | imageUrl" alt="" width="175px" height="98px">
        </el-col>
        <el-col :span="8">
          建议PNG格式，尺寸1920*1080，图片大小不超过1M <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('backgroundUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:100px;" :gutter="5">
        <el-col :span="5">
          安装过程图1
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.installImageUrl1 | imageUrl" alt="" width="175px" height="20px">
        </el-col>
        <el-col :span="8">
          bmp格式，尺寸493*58，图片大小不能超过200K；左侧300*58 <br>
          像素留白，仅可以在右侧193*58中显示logo或宣传语 <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('installImageUrl1')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:150px;" :gutter="5">
        <el-col :span="5">
          安装过程图2
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.installImageUrl2 | imageUrl" alt="" width="175px" height="110px">
        </el-col>
        <el-col :span="8">
          bmp格式，尺寸493*312，图片大小不能超过200K；<br>
          右侧330*312像素留白，仅可以在左侧163*312中显示logo <br>
          或宣传语 <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('installImageUrl2')">上传图片</el-button>
        </el-col>
      </el-row>

      <!-- 使用flex 重新布局 -->
      <el-row style="height:90px;" :gutter="5">
        <el-col :span="5">
          主题颜色
        </el-col>
        <el-col :span="7">
          <el-radio-group class="color-group" v-model="updateForm.color">
            <el-radio class="blue" :label="colors.blue">蓝色</el-radio>
            <el-radio class="gold" :label="colors.gold">金色</el-radio>
            <el-radio class="green" :label="colors.green">绿色</el-radio>
            <el-radio class="orange" :label="colors.orange">橙色</el-radio>
            <el-radio class="red" :label="colors.red">红色</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <!-- {{colors[updateForm.color]}} -->
          请选择主题颜色
        </el-col>
      </el-row>

    </div>

    <br />
    <el-button class="btn-gradient-blue btn-save" type="text" @click="updatePCInfo">保存</el-button>
    <el-button class="btn-gradient-orange" type="text" @click="publishPC" :loading="isPublish || windowsStatus || macStatus" :disabled="hasAbilityOfPublish">发布</el-button>

  </div>
</template>

<script>
import * as jquery from 'jquery'
import global from 'utils/global-data'
import defaultImage from 'assets/black.png'
import api from 'api/index'
import {
  apiServer
} from 'configuration/index'
import {
  NEED_SYSTEM_NAME,
  UPDATE_SUCCESS
} from 'configuration/global-const'

export default {
  name: 'CustomizationPc',
  created() {
    this.getPCInfo()
  },
  data() {
    let colors = {
      blue: '#0a9af9',
      gold: '#d4a660',
      green: '#0da591',
      orange: '#f8922f',
      red: '#a3121a'
    }
    return {
      colors: colors,
      pcForm: {
        macUrl: '',
        version: '',
        windowsUrl: '',
        packAppName: '',
        packName: ''
      },
      updateForm: {
        id: 0,
        appName: '',
        installPackName: '',
        iconUrl: '',
        indexImageUrl: '',
        logoUrl: '',
        backgroundUrl: '',
        installImageUrl1: '',
        installImageUrl2: '',
        color: ''
      },
      uploadImageType: '',
      isShowPackageInfo: false,
      systemVersion: '',
      isHasNewVersion: false,
      isPublish: false,
      publishDate: '',
      windowsStatus: false,
      macStatus: false,
      originWindowsStatus: 0,
      originMacStatus: 0
    }
  },
  computed: {
    hasAbilityOfPublish() {
      for (let item in this.updateForm) {
        if (!this.updateForm[item]) {
          return Boolean(!this.updateForm[item])
        }
      }
    }
  },
  filters: {
    imageUrl(value) {
      if (value && value.indexOf('base64') === -1) {
        return `${apiServer}${value}`
      }
      return defaultImage
    },
    downloadUrl(value) {
      if (value) {
        return `${apiServer}${value}`
      }
    }
  },
  methods: {
    getPCInfo() {
      let requestData = {
        accountId: sessionStorage.getItem('accountId')
      }
      api.customized.getInfoPCClient(requestData).then(response => {
        let resData = response.data
        if (resData.code === '0') {
          let responseData = resData.data
          this.updateForm.color = responseData.desktopCustomized.color || '#0a9af9'
          this.updateForm.appName = responseData.desktopCustomized.appName
          this.pcForm.packAppName = responseData.desktopCustomized.appName
          this.updateForm.backgroundUrl = responseData.desktopCustomized.backgroundUrl
          this.updateForm.iconUrl = responseData.desktopCustomized.iconUrl
          this.updateForm.id = responseData.desktopCustomized.id
          this.updateForm.indexImageUrl = responseData.desktopCustomized.indexImageUrl
          this.updateForm.installImageUrl1 = responseData.desktopCustomized.installImageUrl1
          this.updateForm.installImageUrl2 = responseData.desktopCustomized.installImageUrl2
          this.updateForm.logoUrl = responseData.desktopCustomized.logoUrl
          this.updateForm.installPackName = responseData.desktopCustomized.installPackName
          this.pcForm.packName = responseData.desktopCustomized.packName
          this.pcForm.macUrl = responseData.desktopCustomized.macUrl
          this.pcForm.version = responseData.desktopCustomized.version
          this.pcForm.windowsUrl = responseData.desktopCustomized.windowsUrl
          this.systemVersion = responseData.systemVersion
          // 是否显示安装包信息
          if (responseData.desktopCustomized.version) {
            this.isShowPackageInfo = true
          } else {
            this.isShowPackageInfo = false
          }
          // 是否有新版本
          if (this.systemVersion && this.pcForm.version) {
            let sysVersionArr = this.systemVersion.split('.')
            let sysVersionNum = sysVersionArr[sysVersionArr.length - 1]
            let versionArr = this.pcForm.version.split('.')
            let versionNum = versionArr[versionArr.length - 1]
            if (Number(sysVersionNum) > Number(versionNum)) {
              this.isHasNewVersion = true
            }
          }
          let windowsStatus = responseData.desktopCustomized.windowsStatus
          let macStatus = responseData.desktopCustomized.macStatus
          // mac或windows处于发布状态中
          if (windowsStatus === 2 || macStatus === 2) {
            if (windowsStatus === 2 && macStatus === 2) {
              this.isPublish = true
              this.windowsStatus = false
              this.macStatus = false
            }
            if (windowsStatus === 2 && macStatus !== 2) {
              this.isPublish = false
              this.windowsStatus = true
              this.macStatus = false
            }
            if (windowsStatus !== 2 && macStatus === 2) {
              this.isPublish = false
              this.windowsStatus = false
              this.macStatus = true
            }
            if (!this.publishDate) {
              this.publishDate = new Date().getTime()
            }
            this.getStatusOfPublish()
          }
        } else {
          this.$message.error(resData.message)
        }
      }).catch(error => {
        this.$message.error(error.toString())
      })
    },
    uploadBtnClick(imgaeType) {
      this.uploadImageType = imgaeType
      jquery('#J-pc-input').trigger('click')
    },
    uploadChange(event) {
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
          this.updateForm[this.uploadImageType] = resData.data.filePath
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 修改PC端定制化信息
    updatePCInfo() {
      let requestData = this.updateForm
      let urlData = {
        accountId: sessionStorage.getItem('accountId'),
        id: this.updateForm.id
      }
      // 调用修改接口
      api.customized.updateInfoPCClient(requestData, urlData).then(response => {
        let resData = response.data
        if (resData.code === '0') {
          this.$message.success(UPDATE_SUCCESS)
          this.getPCInfo()
        } else {
          this.$message.error(resData.message)
        }
      }).catch(error => {
        this.$message.error(error.toString())
      })
    },
    publishPC() {
      this.isPublish = true
      // 先保存
      let urlData = {
        accountId: sessionStorage.getItem('accountId'),
        id: this.updateForm.id
      }
      api.customized.updateInfoPCClient(this.updateForm, urlData).then(res => {
        if (res.status === 200) {
          if (res.data.code === '0') {
            // 传入accountId 和 type: Android
            let reqData = {
              accountId: sessionStorage.getItem('accountId'),
              type: 'PC'
            }
            // use api 调用接口
            api.customized.publishClient(reqData).then((res) => {
              if (res.data.code === '0') {
                this.publishDate = new Date().getTime()
                this.getStatusOfPublish()
              } else {
                this.isPublish = false
                this.$message.error(res.data.message)
              }
            }).catch(() => {
              /* this.isPublish = false
              this.$message.error('网络出错') */
              // 对PC发布接口做特殊处理
              this.publishDate = new Date().getTime()
              this.getStatusOfPublish()
            })
          } else {
            this.isPublish = false
            this.$message.error('发布失败')
          }
        } else {
          this.isPublish = false
          this.$message.error('发布失败')
        }
      }).catch((error) => {
        this.isPublish = false
        this.$message.error(error.toString())
      })
    },
    // 定时请求接口，获取发布状态
    getStatusOfPublish() {
      let statusOfPublish = setInterval(() => {
        // 如果循环请求接口的总时长超过10分钟就终止循环
        let nowDate = new Date().getTime() - this.publishDate
        if (nowDate >= 1000 * 600) {
          this.isPublish = false
          this.windowsStatus = false
          this.macStatus = false
          clearInterval(statusOfPublish)
          this.$notify.error({
            title: 'PC发布',
            message: '发布超时，请稍后重试'
          })
          return false
        }
        api.customized.getInfoPCClient({
          accountId: sessionStorage.getItem('accountId')
        }).then(response => {
          if (response.status === 200) {
            let resData = response.data
            if (resData.code === '0') {
              let windowsStatus = resData.data.desktopCustomized.windowsStatus
              let macStatus = resData.data.desktopCustomized.macStatus
              // windows、mac同时在发布过程中
              if (windowsStatus === 2 && macStatus === 2) {
                this.isPublish = true
                this.windowsStatus = false
                this.macStatus = false
              } else if (macStatus === 2 && windowsStatus !== 2) { // 只有mac处于发布过程中
                this.isPublish = false
                this.windowsStatus = false
                this.macStatus = true
                this.updateShowData(resData)
              } else if (windowsStatus === 2 && macStatus !== 2) { // 只有windows处于发布过程中
                this.isPublish = false
                this.windowsStatus = true
                this.macStatus = false
                this.updateShowData(resData)
              } else { // 剩余的所有情况
                this.isPublish = false
                this.windowsStatus = false
                this.macStatus = false
                clearInterval(statusOfPublish)
                if (windowsStatus === 1 && macStatus === 1) {
                  this.$notify.success({
                    title: 'PC发布',
                    message: 'PC发布成功'
                  })
                }
                this.updateShowData(resData)
              }
            } else {
              this.isPublish = false
              this.windowsStatus = false
              this.macStatus = false
              clearInterval(statusOfPublish)
              this.$notify.error({
                title: 'PC发布',
                message: resData.message
              })
            }
          } else {
            this.isPublish = false
            this.windowsStatus = false
            this.macStatus = false
            clearInterval(statusOfPublish)
          }
        }).catch(error => {
          this.isPublish = false
          this.windowsStatus = false
          this.macStatus = false
          clearInterval(statusOfPublish)
          this.$notify.error({
            title: 'PC发布',
            message: error.toString()
          })
        })
      }, 30000)
    },
    // 刷新数据
    updateShowData(resData) {
      let responseData = resData.data
      this.updateForm.color = responseData.desktopCustomized.color
      this.updateForm.appName = responseData.desktopCustomized.appName
      this.pcForm.packAppName = responseData.desktopCustomized.appName
      this.updateForm.backgroundUrl = responseData.desktopCustomized.backgroundUrl
      this.updateForm.iconUrl = responseData.desktopCustomized.iconUrl
      this.updateForm.id = responseData.desktopCustomized.id
      this.updateForm.indexImageUrl = responseData.desktopCustomized.indexImageUrl
      this.updateForm.installImageUrl1 = responseData.desktopCustomized.installImageUrl1
      this.updateForm.installImageUrl2 = responseData.desktopCustomized.installImageUrl2
      this.updateForm.logoUrl = responseData.desktopCustomized.logoUrl
      this.updateForm.installPackName = responseData.desktopCustomized.installPackName
      this.pcForm.packName = responseData.desktopCustomized.packName
      this.pcForm.macUrl = responseData.desktopCustomized.macUrl
      this.pcForm.version = responseData.desktopCustomized.version
      this.pcForm.windowsUrl = responseData.desktopCustomized.windowsUrl
      this.systemVersion = responseData.systemVersion
      // 是否显示安装包信息
      if (responseData.desktopCustomized.version) {
        this.isShowPackageInfo = true
      } else {
        this.isShowPackageInfo = false
      }
      // 是否有新版本
      if (this.systemVersion && this.pcForm.version) {
        let sysVersionArr = this.systemVersion.split('.')
        let sysVersionNum = sysVersionArr[sysVersionArr.length - 1]
        let versionArr = this.pcForm.version.split('.')
        let versionNum = versionArr[versionArr.length - 1]
        if (Number(sysVersionNum) > Number(versionNum)) {
          this.isHasNewVersion = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "index.scss";
</style>
