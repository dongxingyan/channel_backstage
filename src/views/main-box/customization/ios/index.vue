<template lang="html">
  <div class="customization-ios">
    <el-row>
      <el-col class="custom-title" :span="5">iOS客户端</el-col>
      <el-col class="title-tip" :span="7"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;发布制作的app，安装后可见效果</el-col>
      <el-col v-if="isHasNewVersion" class="title-tip title-tip-new" :span="5"><img src="../../../../assets/image/new-tip.png" alt=""> &nbsp;有新版本请重新打包</el-col>
    </el-row>

    <input type="file" id="J-ios-input" @change="uploadChange($event)">

    <h4>安装包信息</h4>
    <el-row class="package-info" v-show="!isShowPackageInfo" v-loading="isPublish" element-loading-text="正在发布中……">
      <el-col >暂未生成版本包</el-col>
    </el-row>
    <el-row class="package-info" v-show="isShowPackageInfo" v-loading="isPublish" element-loading-text="正在发布中……">
      <el-col :span="5">
        应用名称：{{iOSForm.packAppName}}
      </el-col>
      <el-col :span="7">
        版本：{{iOSForm.version}}
      </el-col>
      <el-col :span="8">
        包名：{{iOSForm.packName}}
      </el-col>
      <el-col :span="3">
        <img src="../../../../assets/image/apple.png" alt="">
        <a class="package-info-a" :href="iOSForm.url | downloadUrl">下载</a>
      </el-col>
    </el-row>

    <el-row class="app-made">
      <el-col :span="5" style="font-weight:bold;">APP客户端制作</el-col>
      <el-col class="title-tip" :span="6"><img src="../../../../assets/image/tip.png" alt=""> &nbsp;代码版本{{iOSForm.systemVersion}}</el-col>
    </el-row>

    <!-- form -->

    <div class="form-custom">
      <el-row style="height:72px;" :gutter="5">
        <el-col :span="5">
          App名称
        </el-col>
        <el-col :span="5">
          <el-input v-model="updateForm.appName" :maxlength="30"></el-input>
        </el-col>
      </el-row>

      <el-row style="height:140px;" :gutter="5">
        <el-col :span="5">
          App图标
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.iconUrl | imageUrl" alt="" width="50px" height="50px">
        </el-col>
        <el-col :span="8">
          *图片仅支持png、jpg格式，72dpi最低分辨率，RGB色彩空间 <br>
          *不能包含图层或圆角 <br>
          *不能包含alpha通道或不透明度 <br>
          *上传限制尺寸为1024*1024，大小不能超过1M <br>
          <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('iconUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:174px;" :gutter="5">
        <el-col :span="5">
          启动页
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.startPageUrl | imageUrl" alt="" width="74px" height="133px">
        </el-col>
        <el-col :span="8">
          建议png格式，尺寸750*1334，图片大小不能超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('startPageUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:174px;" :gutter="5">
        <el-col :span="5">
          背景图
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.backgroundUrl | imageUrl" alt="" width="74px" height="133px">
        </el-col>
        <el-col :span="8">
          建议png格式，尺寸1920*1080，图片大小不能超过1M， <br> 中心区域380*400 会被覆盖 <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('backgroundUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:90px;" :gutter="5">
        <el-col :span="5">
          登录页LOGO
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.logoUrl | imageUrl" alt="" width="175px" height="50px">
        </el-col>
        <el-col :span="8">
          建议PNG格式，尺寸627*195，图片大小不超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('logoUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <el-row style="height:92px;" :gutter="5">
        <el-col :span="5">
          呼叫历史页LOGO
        </el-col>
        <el-col :span="7">
          <img :src="updateForm.callHistoryLogoUrl | imageUrl" alt="" width="50px" height="50px">
        </el-col>
        <el-col :span="8">
          建议PNG格式，尺寸123*123，图片大小不超过512K <br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('callHistoryLogoUrl')">上传图片</el-button>
        </el-col>
      </el-row>

      <div class="row-box" style="height:174px">
        <div class="col-box col-box-label">
          <div class="item-content item-content-label">
            ipad端启动页
          </div>
        </div>
        <div class="col-box col-box-input">
          <div class="item-content item-content-input">
            <img :src="updateForm.ipadstartPageUrl | imageUrl" alt="" width="74px" height="133px">
          </div>
        </div>
        <div class="col-box col-box-tips" >
          <div class="item-content item-content-tips">
            png格式，尺寸1536*2048，图片大小不能超过1M<br> <el-button class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('ipadstartPageUrl')">上传图片</el-button>
          </div>
        </div>
      </div>

      <el-row style="height:72px;" :gutter="5">
        <el-col :span="5">
          Apple iTunesconnect账号
        </el-col>
        <el-col :span="8" :offset="7">
          <div>
            <el-radio v-model="updateForm.hasAppleAccount" :label="1">有</el-radio>
            <el-radio v-model="updateForm.hasAppleAccount" :label="0">没有</el-radio>
          </div>
        </el-col>
      </el-row>

      <el-row style="height:72px;" :gutter="5" v-show="updateForm.hasAppleAccount === 1">
        <el-col :span="5">
          Bundle_ID
        </el-col>
        <el-col :span="7">
          {{updateForm.bundleID}}
        </el-col>
        <el-col :span="8">
          请使用此Bundle ID，制作签名
        </el-col>
      </el-row>

      <el-row style="height:243px;" :gutter="5" v-show="updateForm.hasAppleAccount === 1">
        <el-col :span="5">
          证书和PROV文件
        </el-col>
        <el-col :span="12">
          请将以下文件打包成zip格式后提交 <br>
          签名和Provisioning Profile文件： <br>
          签名需要先由一台Mac电脑创建并上传到https://developer.apple.com中，首 <br>
          次创建成功后下载直接双击安装到钥匙串，之后必须从这台电脑导出.p12格式 <br>
          的文件才能使用 <br>
          1) Certificates中的企业iOS应用发行证书，Type为iOS Distribution的证书 <br>
          2) Certificates中的推送证书，Type为APNs Production iOS的证书 <br>
          3) Provisioning Profiles里与Bundle ID对应的PROV文件 <br>
          <el-button v-show="!updateForm.certificateUrl" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('certificateUrl')">上传ZIP包</el-button>
          <el-button v-show="updateForm.certificateUrl" class="btn-up-img" plain type="primary" size="small" @click="uploadBtnClick('certificateUrl')">更新ZIP包</el-button>
        </el-col>
      </el-row>

      <el-row style="height:72px;" :gutter="5" v-show="updateForm.hasAppleAccount === 1">
        <el-col :span="5">
          iOS_Distribution.p12证书密码
        </el-col>
        <el-col :span="5">
          <el-input v-model="updateForm.certificatePassword"></el-input>
        </el-col>
        <el-col :span="8" :offset="2">
          无证书密码，可置空
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
    <el-button class="btn-gradient-blue btn-save" type="text" @click="updateIOSInfo">保存</el-button>
    <el-button class="btn-gradient-orange" type="text" @click="publishIOS" :loading="isPublish" :disabled="hasAbilityOfPublish">发布</el-button>

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
    name: 'CustomizationIos',
    created () {
      this.getIOSInfo()
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
        bundleYesButton: {
          width: '135px',
          borderRadius: '4px',
          borderWidth: '2px',
          fontWeight: 'bold',
          color: '#7b8292'
        },
        bundleNoButton: {
          width: '135px',
          borderRadius: '4px',
          fontWeight: 'bold',
          border: '2px solid #ccc',
          color: '#464545',
          background: '#ccc'
        },
        iOSForm: {
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
          ipadstartPageUrl: '',
          hasAppleAccount: 0,
          bundleID: '',
          certificateUrl: '',
          certificatePassword: '',
          backgroundUrl: '',
          color: '',
          copyright: ''
        },
        appAccountForm: [
          'hasAppleAccount',
          'bundleID',
          'certificateUrl',
          'certificatePassword'
        ],
        accountId: sessionStorage.getItem('accountId'),
        uploadImageType: '',
        isShowPackageInfo: false,
        isHasNewVersion: false,
        isPublish: false,
        publishDate: ''
      }
    },
    computed: {
      hasAbilityOfPublish () {
        let hasAppAccount = parseInt(this.updateForm.hasAppleAccount)
        for (let item in this.updateForm) {
          if (!hasAppAccount && this.appAccountForm.includes(item)) {
            continue
          }
          if (!this.updateForm[item]) {
            return Boolean(!this.updateForm[item])
          }
        }
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
    methods: {
      // 获取IOS移动端信息
      getIOSInfo () {
        let requestData = {
          accountId: sessionStorage.getItem('accountId')
        }
        api.customized.getInfoIOSMobile(requestData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            let responseData = resData.data
            this.updateForm.color = responseData.iosMobileCustomized.color || '#0a9af9'
            this.updateForm.copyright = responseData.iosMobileCustomized.copyright
            this.updateForm.id = responseData.iosMobileCustomized.id
            this.updateForm.appName = responseData.iosMobileCustomized.appName
            this.iOSForm.packAppName = responseData.iosMobileCustomized.appName
            this.iOSForm.version = responseData.iosMobileCustomized.version
            this.iOSForm.packName = responseData.iosMobileCustomized.packName
            this.iOSForm.url = responseData.iosMobileCustomized.url
            this.updateForm.iconUrl = responseData.iosMobileCustomized.iconUrl
            this.updateForm.startPageUrl = responseData.iosMobileCustomized.startPageUrl
            this.updateForm.logoUrl = responseData.iosMobileCustomized.logoUrl
            this.updateForm.callHistoryLogoUrl = responseData.iosMobileCustomized.callHistoryLogoUrl
            this.updateForm.ipadstartPageUrl = responseData.iosMobileCustomized.ipadstartPageUrl
            this.updateForm.hasAppleAccount = responseData.iosMobileCustomized.hasAppleAccount || 0
            this.updateForm.bundleID = responseData.iosMobileCustomized.bundleID
            this.updateForm.certificateUrl = responseData.iosMobileCustomized.certificateUrl
            this.updateForm.certificatePassword = responseData.iosMobileCustomized.certificatePassword
            this.updateForm.backgroundUrl = responseData.iosMobileCustomized.backgroundUrl
            this.iOSForm.systemVersion = responseData.systemVersion
            // 是否显示安装包信息
            if (responseData.iosMobileCustomized.version) {
              this.isShowPackageInfo = true
            } else {
              this.isShowPackageInfo = false
            }
            // 是否有新版本
            if (this.iOSForm.systemVersion && this.updateForm.version) {
              let sysVersionArr = this.iOSForm.systemVersion.split('.')
              let sysVersionNum = sysVersionArr[sysVersionArr.length - 1]
              let versionArr = this.updateForm.version.split('.')
              let versionNum = versionArr[versionArr.length - 1]
              if (Number(sysVersionNum) > Number(versionNum)) {
                this.isHasNewVersion = true
              }
            }
            // 是否正在发布中
            if (responseData.iosMobileCustomized.status === 2) {
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
        jquery('#J-ios-input').trigger('click')
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
            this.$message.error(resData.msg)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      // 修改iOS定制化信息
      updateIOSInfo () {
        let requestData = this.updateForm
        let urlData = {
          accountId: sessionStorage.getItem('accountId'),
          id: this.updateForm.id
        }
        // 调用修改接口
        api.customized.updateInfoIOSMobile(requestData, urlData).then(response => {
          let resData = response.data
          if (resData.code === '0') {
            this.$message.success(UPDATE_SUCCESS)
            this.getIOSInfo()
          } else {
            this.$message.error(resData.message)
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      publishIOS() {
        this.isPublish = true
        // 先保存
        let urlData = {
          accountId: sessionStorage.getItem('accountId'),
          id: this.updateForm.id
        }
        api.customized.updateInfoIOSMobile(this.updateForm, urlData).then(res => {
          if (res.status === 200) {
            if (res.data.code === '0') {
              // 传入accountId 和 type: iOS
              let reqData = {
                accountId: sessionStorage.getItem('accountId'),
                type: 'iOS'
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
          api.customized.getInfoIOSMobile({
            accountId: sessionStorage.getItem('accountId')
          }).then(response => {
            if (response.status === 200) {
              let resData = response.data
              if (resData.code === '0') {
                let publishStatus = resData.data.iosMobileCustomized.status
                if (publishStatus === 1) {
                  this.isPublish = false
                  clearInterval(statusOfPublish)
                  this.$notify({
                    title: 'iOS发布',
                    message: 'iOS发布成功',
                    type: 'success'
                  })
                  this.getIOSInfo()
                } else if (publishStatus === 3) {
                  this.isPublish = false
                  clearInterval(statusOfPublish)
                  this.$notify.error({
                    title: 'iOS发布',
                    message: 'iOS发布失败'
                  })
                }
              } else {
                this.isPublish = false
                clearInterval(statusOfPublish)
                this.$notify.error({
                  title: 'iOS发布',
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
              title: 'iOS发布',
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
