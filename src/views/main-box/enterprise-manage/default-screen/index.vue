<template lang="html">
<div class="default-screen">
  <div class="header">
    <span class="header-title">默认首屏管理</span>
  </div>
  <!-- 可编辑状态 -->
  <div class="after-edit-container" v-show="isEditing">
    <div class="edit-module-after" >
        <img src="../../../../assets/image/enterprise/edit-gray.png" alt="">
        <span> 编辑模块</span>
    </div>

    <div class="edit-container">
        <div class="logo-box">
          <img class="logo-img" :src="editScreenForm.logoUrl | formatImgUrl" width="120px" height="30px">
          <span class="up-logo" @click="editLogoOpen()">上传LOGO</span>
        </div>

        <draggable class="boxs" v-model="editScreenForm.screenList" :options="{animation: 1000, draggable: '.box', dragClass: 'drag-item', ghostClass: 'ghost-item', chosenClass: 'chosen-item'}">
          <!-- <transition-group class="boxs" tag="div" move-class="move"> -->
            <div class="box" v-for="(item, index) in editScreenForm.screenList" :key="item.screenId">
              <div class="box-header">
                {{item.tofuName}}
              </div>
              <div class="img-area">
                <img class="inner-img" :src="item.url | formatImgUrl" alt="">
              </div>
              <div class="color-gradient">
                <div class="span-top">
                  {{item.title}}
                </div>
                <div class="span-bottom">
                  {{item.subtitle}}
                </div>
              </div>
              <div class="delete-area">
                <span v-show="item.type != 1" class="box-footer" @click="removeModule(item, index)">
                  <img src="../../../../assets/image/enterprise/delete-module.png" alt="">
                  <span>删除模块</span>
                </span>
              </div>
            </div>

            <div class="add-module-box" @click="addTofuVisible=true" :key="999">
              <img src="../../../../assets/image/enterprise/add-module.png" alt="">
            </div>
          <!-- </transition-group> -->
        </draggable>

    </div>

    <div class="btn-two">
      <el-button class="btn-gradient-blue" type="text" @click="editScreenSave()">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="editScreenCancel()">取消</el-button>
    </div>
  </div>

  <!-- 不可编辑状态 -->
  <div class="before-edit-container" v-show="!isEditing">
    <div class="edit-module-before">
        <img src="../../../../assets/image/enterprise/edit.png" alt="">
        <span @click="startEditing()"> 编辑模块</span>
    </div>

    <div class="edit-container">
      <div class="logo-box">
        <img class="logo-img" :src="screenData.logoUrl | formatImgUrl" alt="" width="120px" height="30px">
      </div>

      <div class="boxs" >
          <div class="box" v-for="item in screenData.screenList">
            <div class="box-header">
              {{item.tofuName}}
            </div>
            <img class="inner-img" :src="item.url | formatImgUrl" alt="">
            <div class="color-gradient">
              <div class="span-top">
                {{item.title}}
              </div>
              <div class="span-bottom">
                {{item.subtitle}}
              </div>
            </div>
          </div>
      </div>
    </div>

  </div>

  <!-- 首屏logo编辑 dialog-->
  <el-dialog class="logo-edit-dialog" title="首屏LOGO编辑" :visible.sync="editLogoVisible">
    <el-row :gutter="40">
      <el-col class="dialog-left-text" :span="6">
        首屏LOGO：
      </el-col>
      <el-col :span="18">
        <div class="">
          <img :src="curEditLogoUrl | defaultImgUrl" width="130px" height="60px">
        </div>
        <div class="text-tip">
          图片大小不能超过512k，高度最大68px
        </div>
        <el-button class="btn-upfile" type="primary" @click="upfileBtnClick()">上传图片</el-button>
      </el-col>
    </el-row>

    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="editLogoSave()">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="editLogoCancel()">取消</el-button>
    </div>
  </el-dialog>

  <!-- 添加豆腐块dialog -->
  <el-dialog title="添加豆腐块" :visible.sync="addTofuVisible" @close="commonDialogCancel('addTofuForm')">
    <el-form ref="addTofuForm" :model="addTofuForm" label-width="120px">
      <el-row :gutter="40">
        <el-col class="dialog-left-text" :span="6">选择相关信息：</el-col>
        <el-col :span="12" >
            <el-form-item label="豆腐块名称：" prop="tofuId" :rules="{required: true, message: '请选择豆腐块'}">
              <el-select v-model="addTofuForm.tofuId" @change="selectedTofuChange" placeholder="请选择豆腐块" filterable clearable>
                <el-option v-for="item in validTofus" :key="item.id"
                :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col class="dialog-left-text" :span="6">豆腐块提示信息：</el-col>
          <el-col :span="10" >
              <el-form-item label="关联APK：" prop="apkName">
                <span>{{addTofuForm.apkName}}</span>
              </el-form-item>
          </el-col>
        </el-row>

        <el-table :data="addTofuForm.selectedTofuDetail" border>
          <el-table-column label="标题" prop="title" align="center" header-align="center"></el-table-column>
          <el-table-column label="副标题" prop="subtitle" align="center" header-align="center"></el-table-column>
          <el-table-column label="状态" align="center" header-align="center">
            <template slot-scope="{row}">
              <span class="has-valid" v-if="row.status==1">有效</span>
              <span class="no-valid" v-else>无效</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" align="center" header-align="center">
            <img slot-scope="{row}" :src="row.url | formatImgUrl" alt="" width="22px" height="26px">
          </el-table-column>
        </el-table>
    </el-form>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="addTofuSave('addTofuForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="addTofuVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 删除提示dialog -->
  <el-dialog class="delete-boxes-dialog" title="提示" width="400px" :visible.sync="deleteModuleVisible">
    <div class="delete-tip">
      删除之后不可恢复，确定删除？
    </div>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text">确定</el-button>
      <el-button class="btn-gradient-orange" type="text">取消</el-button>
    </div>
  </el-dialog>

  <input type="file" id="J-upfile" @change="uploadChange($event)">
</div>
</template>

<script>
import api from 'api/index'
import {
  apiServer
} from 'configuration/index'
import defaultImage from 'assets/black.png'
import draggable from 'vuedraggable'

export default {
  name: 'DefaultScreen',
  components: {
    draggable
  },
  data() {
    let searchOptions = [{
      label: 'MAC/SN',
      value: 1
    }, {
      label: '机构',
      value: 2
    }]
    return {
      validTofus: [],
      isEditing: false,
      curEditLogoUrl: '',
      searchForm: {
        keyword: '',
        type: 1, // 搜索的类型
        options: searchOptions // 搜索下拉项
      },
      addTofuForm: {
        apkName: '',
        tofuName: '',
        selectedTofuDetail: [] // 选中豆腐块然后查询信息
      },
      screenData: {
        logoUrl: '',
        screenList: [],
        delIds: []
      }, // 数据副本
      editScreenForm: {
        logoUrl: '',
        screenList: [],
        delIds: []
      },
      editLogoVisible: false,
      addTofuVisible: false,
      deleteModuleVisible: false
    }
  },
  created() {
    this.getScreenInfo()
    this.getValidTofus()
  },
  filters: {
    formatImgUrl(value) {
      return value ? `${apiServer}${value}` : ''
    },
    defaultImgUrl(value) {
      return value ? `${apiServer}${value}` : defaultImage
    }
  },
  methods: {
    // 通用dialog取消，清除表单验证和数据归零
    commonDialogCancel(formName) {
      this.$refs[formName].resetFields()
      let form = this.$data[formName]
      // 针对于 form 上的 数组的 只能恢复到长度相等，并不能内部数据清零
      for (let arr of Object.values(form)) {
        if (arr instanceof Array) {
          arr = arr.splice(0, arr.length)
        }
      }
    },
    // 点击上传版本文件
    upfileBtnClick() {
      document.querySelector('#J-upfile').click()
    },
    uploadChange(event) {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      api.defaultScreen.uploadFile(formData).then((res) => {
        if (res.data.code === '0') {
          this.curEditLogoUrl = res.data.data.filePath
        } else {
          this.$message.error('上传失败')
        }
      })
    },
    getScreenInfo() {
      api.defaultScreen.tofuManageInfo().then((res) => {
        if (res.data.code === '0') {
          let resData = res.data.data
          this.screenData.logoUrl = resData.accountGroup.logoUrl
          this.screenData.screenList = resData.beanCurdCubeScreenList.map((item) => {
            let box = {
              screenId: item.id,
              tofuId: item.beanCurdCubeId,
              tofuName: item.beanCurdCubeName,
              type: item.type
            }
            let obj = item.detailList[0]
            if (obj) {
              Object.assign(box, {
                title: obj.title,
                subtitle: obj.subtitle,
                url: obj.url
              })
            }
            return box
          })
        } else {
          this.$message.error('获取信息失败')
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    getValidTofus() {
      api.defaultScreen.queryValidTofus().then((res) => {
        if (res.data.code === '0') {
          this.validTofus = res.data.data
        }
      })
    },
    startEditing() {
      this.isEditing = true
      this.editScreenForm = JSON.parse(JSON.stringify(this.screenData))
    },
    editScreenSave() {
      this.isEditing = false
      let list = this.editScreenForm.screenList.map((item, index) => {
        return {
          id: item.screenId ? item.screenId : 0,
          sort: index + 1,
          beanCurdCubeId: item.tofuId,
          accountId: sessionStorage.accountId
        }
      })
      let reqData = {
        delIds: this.editScreenForm.delIds,
        beanCurdCubeScreenList: list,
        logoUrl: this.editScreenForm.logoUrl
      }
      api.defaultScreen.editScreenList(reqData).then((res) => {
        if (res.data.code === '0') {
          this.getScreenInfo()
        } else {
          this.$message.error('编辑失败')
        }
      })
    },
    editScreenCancel() {
      this.isEditing = false
      // 数据清零
    },
    editLogoOpen() {
      this.editLogoVisible = true
      this.curEditLogoUrl = this.editScreenForm.logoUrl
    },
    editLogoSave() {
      this.editLogoVisible = false
      this.editScreenForm.logoUrl = this.curEditLogoUrl
    },
    editLogoCancel() {
      this.editLogoVisible = false
    },
    removeModule(item, index) {
      // 删除模块判断是不是原来存在的
      if (item.screenId) {
        this.editScreenForm.delIds.push(item.screenId)
      }
      this.editScreenForm.screenList.splice(index, 1)
    },
    selectedTofuChange(tofuId) {
      // 选中豆腐块，查询信息显示
      api.tofu.queryTofuDetail({
        beanCurdCubeId: tofuId
      }).then((res) => {
        if (res.data.code === '0') {
          let resData = res.data.data
          let detail = resData.beanCurdCubeDtails[0]
          this.addTofuForm.apkName = resData.beanCurdCube.apkName
          this.addTofuForm.tofuName = resData.beanCurdCube.name
          this.addTofuForm.selectedTofuDetail = resData.beanCurdCubeDtails
        }
      })
    },
    addTofuSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addTofuVisible = false
          let tofuData = this.addTofuForm
          let detail = tofuData.selectedTofuDetail[0]
          let screen = {
            tofuId: tofuData.tofuId,
            tofuName: tofuData.tofuName
          }
          if (detail) {
            Object.assign(screen, {
              title: detail.title,
              subtitle: detail.subtitle,
              url: detail.url
            })
          }
          this.editScreenForm.screenList.push(screen)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'index'
</style>
