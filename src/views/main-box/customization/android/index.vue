<template lang="html">
  <div class="customization-android">
    <el-row>
      <el-col class="custom-title" :span="5">Android客户端</el-col>
      <el-col class="title-tip" :span="7"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;发布制作的app，安装后可见效果</el-col>
      <el-col v-if="isHasNewVersion" class="title-tip title-tip-new" :span="5"><img src="../../../../assets/image/new-tip.png" alt=""> &nbsp;有新版本请重新打包</el-col>
    </el-row>

    <input type="file" id="J-android-input" @change="uploadChange($event)" v-show="false">

    <h4>安装包信息</h4>
    <el-row class="package-info" v-show="!isShowPackageInfo" v-loading="isPublish" element-loading-text="正在发布中……">
      <el-col >暂未生成版本包</el-col>
    </el-row>
    <el-row class="package-info" v-show="isShowPackageInfo" v-loading="isPublish" element-loading-text="正在发布中……">
      <el-col :span="5">
        应用名称：{{androidForm.packAppName}}
      </el-col>
      <el-col :span="7">
        版本：{{androidForm.version}}
      </el-col>
      <el-col :span="8">
        包名：{{androidForm.packageName}}
      </el-col>
      <el-col :span="3">
        <img src="../../../../assets/image/android.png" alt="">
        <a class="package-info-a" :href="androidForm.url | downloadUrl">下载</a>
      </el-col>
    </el-row>

    <el-row class="app-made">
      <el-col :span="5" style="font-weight:bold;">APP客户端制作</el-col>
      <el-col class="title-tip" :span="5"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;代码版本{{androidForm.systemVersion}}</el-col>
    </el-row>

    <!-- form -->

    <div class="form-custom">
      <el-row style="height:72px" :gutter="5">
        <el-col :span="5">
          App名称
        </el-col>
        <el-col :span="5">
          <el-input v-model="updateForm.appName" :maxlength="30"></el-input>
        </el-col>
      </el-row>

      <el-row style="height:140px" :gutter="5">
        <el-col :span="5">
          App图标
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.iconUrl | imageUrl" alt="" width="50px" height="50px">
        </el-col>
        <el-col :span="8" >
          *图片仅支持png、jpg格式，72dpi最低分辨率，RGB色彩空间 <br>
          *不能包含图层或圆角 <br>
          *不能包含alpha通道或不透明度 <br>
          *上传限制尺寸为1024*1024，大小不能超过1M <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('iconUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:174px" :gutter="5">
        <el-col :span="5">
          背景图
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.startPageUrl | imageUrl" alt="" width="74px" height="133px">
        </el-col>
        <el-col :span="8" >
          建议 PNG格式 ,尺寸750*1334 ,图片大小不能超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('startPageUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:90px" :gutter="5">
        <el-col :span="5">
          登录页LOGO
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.logoUrl | imageUrl" alt="" width="175px" height="50px">
        </el-col>
        <el-col :span="8" >
          建议PNG格式，尺寸627*195，图片大小不超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('logoUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:92px" :gutter="5">
        <el-col :span="5">
          呼叫历史页LOGO
        </el-col>
        <el-col :span="7">
          <img class="item-content-input-img" :src="updateForm.callHistoryLogoUrl | imageUrl" alt="" width="50px" height="50px">
        </el-col>
        <el-col :span="8" >
          建议PNG格式，尺寸123*123，图片大小不超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('callHistoryLogoUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:66px;" :gutter="5">
        <el-col :span="5">
          版权配置
        </el-col>
        <el-col :span="5">
          <el-input v-model="updateForm.copyright" :maxlength="20"></el-input>
        </el-col>
        <el-col :span="8" :offset="2">
          注：限制输入20个字符
        </el-col>
      </el-row>

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

    <br>
    <el-button class="btn-gradient-blue btn-save" type="text" @click="updateAndroidInfo">保存</el-button>
    <el-button class="btn-gradient-orange" type="text" @click="publishAndroid" :loading="isPublish"  :disabled="hasAbilityOfPublish">发布</el-button>

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
    name: 'CustomizationAndroid',
    created () {
      this.getAndroidInfo()
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
        accountId: sessionStorage.getItem('accountId'),
        androidForm: {
          version: '',
          packageName: '',
          url: '',
          systemVersion: '',
          packAppName: ''
        },
        updateForm: {
          id: '',
          appName: '',
          iconUrl: '',
          startPageUrl: '',
          logoUrl: '',
          callHistoryLogoUrl: '',
          color: '',
          copyright: ''
        },
        isShowPackageInfo: false,
        isHasNewVersion: false,
        isPublish: false,
        publishDate: ''
      }
    },
    filters: {
      imageUrl (value) {
        if (value && value.indexOf('base64') === -1) {
          return `${apiServer}${value}`
        }
        return defaultImage
      },
      downloadUrl (value) {
        if (value) {
          return `${apiServer}${value}`
        }
      }
    },
    computed: {
      hasAbilityOfPublish () {
        for (let item in this.updateForm) {
          if (!this.updateForm[item]) {
            return Boolean(!this.updateForm[item])
          }
        }
      }
    },
    methods: {
      getAndroidInfo () {
        let requestData = {
          accountId: sessionStorage.getItem('accountId')
        }
        api.customized.getInfoAndroidMobile(requestData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            let responseData = resData.data
            this.updateForm.color = responseData.androidMobileCustomized.color || '#0a9af9'
            this.updateForm.copyright = responseData.androidMobileCustomized.copyright
            this.updateForm.id = responseData.androidMobileCustomized.id
            this.updateForm.appName = responseData.androidMobileCustomized.appName
            this.androidForm.packAppName = responseData.androidMobileCustomized.appName
            this.androidForm.version = responseData.androidMobileCustomized.version
            this.androidForm.packageName = responseData.androidMobileCustomized.packName
            this.androidForm.url = responseData.androidMobileCustomized.url
            this.updateForm.iconUrl = responseData.androidMobileCustomized.iconUrl
            this.updateForm.startPageUrl = responseData.androidMobileCustomized.startPageUrl
            this.updateForm.logoUrl = responseData.androidMobileCustomized.logoUrl
            this.updateForm.callHistoryLogoUrl = responseData.androidMobileCustomized.callHistoryLogoUrl
            this.androidForm.systemVersion = responseData.systemVersion
            // 是否显示安装包信息
            if (responseData.androidMobileCustomized.version) {
              this.isShowPackageInfo = true
            } else {
              this.isShowPackageInfo = false
            }
            // 是否有新版本
            if (this.androidForm.systemVersion && this.androidForm.version) {
              let sysVersionArr = this.androidForm.systemVersion.split('.')
              let sysVersionNum = sysVersionArr[sysVersionArr.length - 1]
              let versionArr = this.androidForm.version.split('.')
              let versionNum = versionArr[versionArr.length - 1]
              if (Number(sysVersionNum) > Number(versionNum)) {
                this.isHasNewVersion = true
              }
            }
            // 是否正在发布中
            if (responseData.androidMobileCustomized.status === 2) {
              this.isPublish = true
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
      uploadBtnClick (imgaeType) {
        this.uploadImageType = imgaeType
        jquery('#J-android-input').trigger('click')
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
            this.updateForm[this.uploadImageType] = resData.data.filePath
          } else {
            this.$message.error(resData.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      // 修改Android定制化信息
      updateAndroidInfo () {
        let requestData = this.updateForm
        let urlData = {
          accountId: sessionStorage.getItem('accountId'),
          id: this.updateForm.id
        }
        // 调用修改接口
        api.customized.updateInfoAndroidMobile(requestData, urlData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success(UPDATE_SUCCESS)
            this.getAndroidInfo()
          } else {
            this.$message.error(resData.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      // 发布Android
      publishAndroid () {
        this.isPublish = true
        // 发布前，先保存
        let urlData = {
          accountId: sessionStorage.getItem('accountId'),
          id: this.updateForm.id
        }
        api.customized.updateInfoAndroidMobile(this.updateForm, urlData).then(res => {
          if (res.status === 200) {
            if (res.data.code === '0') {
              // 保存成功
              // 传入accountId 和 type: Android
              let reqData = {
                accountId: sessionStorage.getItem('accountId'),
                type: 'Android'
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
                this.isPublish = false
                this.$message.error('网络出错')
              })
            } else {
              this.isPublish = false
              this.$message.error('发布失败')
            }
          } else {
            this.isPublish = false
            this.$message.error('发布失败')
          }
        }).catch(() => {
          this.isPublish = false
          this.$message.error('网络出错')
        })
      },
      // 定时请求接口，获取发布状态
      getStatusOfPublish () {
        let statusOfPublish = setInterval(() => {
          // 如果循环请求接口的总时长超过10分钟就终止循环
          let nowDate = new Date().getTime() - this.publishDate
          if (nowDate >= 1000 * 600) {
            this.isPublish = false
            clearInterval(statusOfPublish)
            this.$notify.error({
              title: 'iOS发布',
              message: '发布超时，请稍后重试'
            })
            return false
          }
          let requestData = {
            accountId: sessionStorage.getItem('accountId')
          }
          api.customized.getInfoAndroidMobile(requestData).then(response => {
            if (response.status === 200) {
              let resData = response.data
              if (resData.code === '0') {
                let status = resData.data.androidMobileCustomized.status
                if (status === 1) {
                  this.isPublish = false
                  clearInterval(statusOfPublish)
                  this.$notify({
                    title: 'Android发布',
                    message: 'Android发布成功',
                    type: 'success'
                  })
                  this.getAndroidInfo()
                } else if (status === 3) {
                  this.isPublish = false
                  clearInterval(statusOfPublish)
                  this.$notify.error({
                    title: 'Android发布',
                    message: 'Android发布失败'
                  })
                }
              } else {
                this.isPublish = false
                clearInterval(statusOfPublish)
                this.$notify.error({
                  title: 'Android发布',
                  message: resData.message
                })
              }
            } else {
              this.isPublish = false
              clearInterval(statusOfPublish)
            }
          }).catch(error => {
            this.isPublish = false
            clearInterval(statusOfPublish)
            this.$notify.error({
              title: 'Android发布',
              message: error.toString()
            })
          })
        }, 30000)
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
