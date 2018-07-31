<template lang="html">
<div class="apk">
  <input type="file" id="J-upfile" @change="uploadChange($event)">
  <div class="header">
    <span class="header-title">定制APK管理</span>
    <div class="search-area">
      <el-autocomplete class="input-area" :fetch-suggestions="querySearchTips" @select="handleSuggestSelect" v-model.trim="searchForm.keyword" placeholder="请输入内容" >
        <el-select popper-class="custom-select" v-model="searchForm.type" slot="prepend">
          <el-option v-for="item in searchForm.options" :key="item.value"
          :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button slot="append">
          <img class="serach-img" @click="searchApks()" src="../../../../assets/image/enterprise/search.png" alt="">
        </el-button>
      </el-autocomplete>
      <el-button class="btn-gradient-blue" type="text" @click="addApkVisible = true">新增</el-button>
    </div>
  </div>

  <el-table class="data-table" :data="tableData" @select="handleTableSelect" @select-all="handleTableSelectAll">
    <el-table-column type="selection" :selectable="judgeSelectable" label-class-name="all-select"></el-table-column>
    <el-table-column label="apk名称" prop="name"></el-table-column>
    <el-table-column label="所属" prop="ofName"></el-table-column>
    <el-table-column label="类别" prop="type" :formatter="formatCategory"></el-table-column>
    <el-table-column label="版本号" prop="versionNum"></el-table-column>
    <el-table-column label="安装方式" prop="installWay" :formatter="formatInstallWay"></el-table-column>
    <el-table-column label="上线|下线" width="150px">
      <template slot-scope="{row}" v-if="row.type>1">
      <el-radio-group class="onlie-group" v-model="row.online" @change="handleOnlineChange(row.online, row.id)">
        <el-radio-button :label="1">
          <template slot>上线</template>
        </el-radio-button>
        <el-radio-button class="off-line" :label="0">
          <template slot>下线</template>
        </el-radio-button>
      </el-radio-group>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150px">
      <template slot-scope="{row, $index}" v-if="row.type>1">
        <span class="opera" @click="versionManageDialogOpen(row, $index)">版本管理</span>
        <span class="opera" @click="editApkDialogOpen(row, $index)"><img src="../../../../assets/image/enterprise/edit.png" alt=""></span>
        <span class="opera" @click="deleteOneApkDialogOpen(row)"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""></span>
      </template>
    </el-table-column>
  </el-table>

  <el-row>
    <el-col :span="8">
      <!-- 全选和分配 -->
      <div class="check-all-container" >
        <el-checkbox class="check-all" v-model="selectAllChecked" label="全选" @click.native="triggerSelctAll()"></el-checkbox>
        <el-button class="delete-btn" type="text" @click="deleteAllApksOpen()"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""> 删除</el-button>
      </div>
    </el-col>

    <el-col :span="16">
      <!-- 分页 -->
      <el-pagination class="pager-pagination" :total="pageParams.totalSize" :current-page.sync="pageParams.pageID" @current-change="getApksList" @size-change="handleSizeChange" :page-sizes="[10, 20, 50]" layout="sizes, total, slot, prev, pager, next, jumper">
        <span class="page-size-tip">每页{{pageParams.pageSize}}条</span>
      </el-pagination>
    </el-col>
  </el-row>

  <!-- 新增APK dialog -->
  <el-dialog title="新增APK" :visible.sync="addApkVisible" @close="commonDialogCancel('addApkForm')">
    <el-form status-icon :rules="addApkFormRules" ref="addApkForm" label-width="100px" :model="addApkForm">
      <el-row :gutter="40">
        <el-col class="dialog-left-text" :span="6">填写相关信息：</el-col>
        <el-col :span="12">
          <el-form-item label="apk名称：" prop="name">
            <el-input v-model.trim="addApkForm.name" placeholder="请填写apk名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-row :gutter="40">
        <el-col class="dialog-left-text" :span="6">选择相关信息：</el-col>
        <el-col :span="12">
          <el-form-item label="安装方式：" prop="installWay">
            <el-select popper-class="custom-select" v-model="addApkForm.installWay" placeholder="请选择安装方式">
              <el-option v-for="item in installWaysOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="addApkDialogSave('addApkForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="addApkVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 编辑 dialog -->
  <el-dialog title="编辑" :visible.sync="editApkVisible" @close="commonClearValidate('editApkForm')">
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-form ref="editApkForm" label-width="100px" :model="editApkForm">
          <el-form-item label="APK名称：" prop="name" :rules="{required: true, message: '请输入APK名称'}">
            <el-input v-model.trim="editApkForm.name" placeholder="请输入APK名称"></el-input>
          </el-form-item>
          <el-form-item label="安装方式：">
            <el-select v-model="editApkForm.installWay" popper-class="custom-select">
              <el-option v-for="item in installWaysOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="editApkDialogSave('editApkForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="editApkVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 版本管理dialog -->
  <el-dialog custom-class="version-manage-dialog" title="版本管理"  :visible.sync="versionManageVisible" @close="versionManageDialogCancel()">
    <div class="header">
      <span>apk名称：</span>
      <span class="apk-name">鹏云课堂</span>
      <el-button class="btn-upfile" type="primary" @click="addVersionVisible = true">新增版本</el-button>
    </div>
    <p>版本管理：</p>
    <el-table :data="versionManageData.versionTableData" border max-height="500px">
      <el-table-column label="版本号" prop="versionNum" width="80px">
      </el-table-column>
      <el-table-column label="版本描述" prop="versionDesc">
      </el-table-column>
      <el-table-column label="包名" prop="packName">
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime" :formatter="formatDateTime"></el-table-column>
      <el-table-column label="操作" width="70px" >
        <template slot-scope="{row,$index}">
          <span class="opera" @click="alterVersionDialogOpen(row)"><img src="../../../../assets/image/enterprise/edit.png" alt=""></span>
          <span class="opera" @click="deleteOneVersion(row)" v-if="$index > 0" ><img src="../../../../assets/image/enterprise/delete-red.png" alt=""></span>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination class="pagination" :total="versionManageData.pageParams.totalSize" :page-size="versionManageData.pageParams.pageSize" :current-page.sync="versionManageData.pageParams.pageID" @current-change="getApkVersions()" layout="total, slot, prev, pager, next">
      <span class="page-size-tip">每页{{versionManageData.pageParams.pageSize}}条</span>
    </el-pagination>
  </el-dialog>

  <!-- 新增版本 -->
  <el-dialog custom-class="add-version-dialog" title="新增版本" :visible.sync="addVersionVisible" @close="commonDialogCancel('addVersionForm')">
    <el-row>
      <el-col :span="16" :offset="2">
        <el-form status-icon ref="addVersionForm" :model="addVersionForm" :rules="versionFormRules" label-width="100px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="版本号：" prop="versionNum">
                <el-input v-model.trim="addVersionForm.versionNum"  placeholder="请输入版本号"></el-input>
              </el-form-item>
              <el-form-item label="包名：" prop="packName">
                <el-input v-model.trim="addVersionForm.packName" placeholder="请输入包名"></el-input>
              </el-form-item>
              <el-form-item label="安装包：" prop="packUrl">
                <el-input disabled v-model="dealAddPackUrl"></el-input>
                <el-button class="btn-upfile" type="primary" @click="upfileBtnClick()">上传文件</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="版本简介：" prop="versionDesc">
            <el-input type="textarea" v-model="addVersionForm.versionDesc" placeholder="版本描述"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="addVersionDialogSave('addVersionForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="addVersionVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 修改版本dialog -->
  <el-dialog custom-class="alter-version-dialog" title="修改版本" :visible.sync="alterApkVersionVisible" >
    <el-row>
      <el-col :span="16" :offset="2">
        <el-form status-icon ref="alterVersionForm" :model="alterVersionForm" :rules="versionFormRules" label-width="100px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="版本号：" prop="versionNum">
                <el-input v-model.trim="alterVersionForm.versionNum"  placeholder="请输入版本号"></el-input>
              </el-form-item>
              <el-form-item label="包名：" prop="packName">
                <el-input v-model.trim="alterVersionForm.packName" placeholder="请输入包名"></el-input>
              </el-form-item>
              <el-form-item label="安装包：" prop="packUrl">
                <el-input disabled v-model="dealAlterPackUrl"></el-input>
                <el-button class="btn-upfile" type="primary" @click="upfileBtnClick">上传文件</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="版本简介：" prop="versionDesc">
            <el-input type="textarea" v-model="alterVersionForm.versionDesc" placeholder="版本描述"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="alterVersionDialogSave('alterVersionForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="alterApkVersionVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 删除提示dialog -->
  <el-dialog class="delete-boxes-dialog" title="提示" width="400px" :visible.sync="deleteDialogVisible">
    <div class="delete-tip">
      删除之后不可恢复，确定删除？
    </div>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="deleteDialogSave()">确定</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="deleteDialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import FormatDate from 'utils/format-date'
import api from 'api/index'
import {
  apiServer
} from 'configuration/index'

export default {
  name: 'ApkManage',
  data() {
    let installWays = [{
      label: '静默安装',
      value: 1
    }, {
      label: '询问安装',
      value: 2
    }]

    let addApkFormRules = {
      name: [{
        required: true,
        message: '请填写apk名称'
      }]
    }

    let validateVersionNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写版本号'))
      } else if (/^[1-9]\d*$/.test(value)) {
        callback()
      } else {
        callback(new Error('版本号必须为大于0的数字'))
      }
    }

    let versionFormRules = {
      versionNum: [{
        required: true,
        validator: validateVersionNum
      }],
      packName: [{
        required: true,
        message: '请填写包名'
      }],
      packUrl: []
    }

    let searchOptions = [{
      label: 'apk名称',
      value: 1
    }, {
      label: '所属',
      value: 2
    }]

    return {
      rowDataFlag: '',
      installWaysOptions: installWays, // 安装方式下拉列表值
      orgs: '', // 查询出当下所有机构
      selectAllChecked: false, // 自定义的全选按钮
      elAllSelectDom: {}, // element table 全选 dom
      searchForm: {
        keyword: '', // input content
        type: 1, // 搜索的类型
        options: searchOptions, // 搜索下拉项,
        queryAccountId: '',
        apkName: ''
      },
      // 编辑apk
      editApkForm: {
        name: '',
        installWay: ''
      },
      // 新增apk
      addApkForm: {
        name: '',
        installWay: 1
      },
      addApkFormRules: addApkFormRules,
      versionFormRules: versionFormRules,
      // 如何通用删除dialog, 谁打开的dialog 就改变相应的数据
      curDeleteParams: '',
      curDeleteMethod: '',
      curSelcectApks: [], // 当前选择的 apk
      tableData: [],
      pageParams: {
        pageID: 1,
        pageSize: 10,
        totalSize: 0
      },
      // 新增版本和修改模块 通用的中间对象
      alterVersionForm: {
        packUrl: ''
      },
      addVersionForm: {
        packUrl: '',
        versionDesc: '',
        versionNum: ''
      },
      versionPageParams: {
        pageID: 1,
        pageSize: 6,
        totalSize: 0
      },
      // apk 版本管理模态框内部数据，
      versionManageData: {
        pageParams: {
          pageID: 1,
          pageSize: 6,
          totalSize: 0
        },
        curApkId: 0,
        versionTableData: []
      },
      addApkVisible: false,
      versionManageVisible: false,
      editApkVisible: false,
      addVersionVisible: false,
      deleteDialogVisible: false,
      alterApkVersionVisible: false,
      curEditIndex: '' // 修改数据不拉去列表，缓存当前索引
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.elAllSelectDom = document.querySelector('.cell.all-select .el-checkbox')
      // 点击建议框 清空内容
      document.querySelector('.input-area>div>input').addEventListener('focusin', () => {
        this.searchForm.keyword = ''
      })
    })
  },
  computed: {
    dealAddPackUrl() {
      let packUrl = this.addVersionForm.packUrl
      return packUrl ? `${apiServer}${packUrl}` : ''
    },
    dealAlterPackUrl() {
      let packUrl = this.alterVersionForm.packUrl
      return packUrl ? `${apiServer}${packUrl}` : ''
    }
  },
  created() {
    this.getApksList()
    this.getOrgs()
  },
  methods: {
    // 判断系统应用前方的不可选中
    judgeSelectable(row, index) {
      return row.type > 1 ? true : false
    },
    // 格式化安装方式
    formatInstallWay(row, column, cellValue) {
      return cellValue === 1 ? '静默安装' : '询问安装'
    },
    formatCategory(row, column, cellValue) {
      // 类别：1为系统应用，2为渠道定制，3为机构定制
      if (cellValue === 1) {
        return '系统应用'
      } else if (cellValue === 2) {
        return '渠道定制'
      } else {
        return '机构定制'
      }
    },
    formatDateTime(row, column, cellValue) {
      return FormatDate.timestampToDate(cellValue)
    },
    // 下拉列表模糊查询筛选方法
    querySearchTips(queryString, cb) {
      queryString = this.searchForm.keyword
      // 区分开 apkName 还是机构
      if (this.searchForm.type == 1) {
        // by apkName
        let arr = []
        return cb(arr)
      }
      let orgs = this.orgs
      let results = queryString ? orgs.filter((item) => {
        if (item.value.includes(queryString)) {
          return true
        }
      }) : orgs
      cb(results)
    },
    // 获取查询出的apk通用方法，参数对象assign合并
    getApksList(otherData) {
      this.selectAllChecked = false
      let reqData = {
        start: this.pageParams.pageID,
        size: this.pageParams.pageSize,
        apkName: this.searchForm.apkName,
        queryAccountId: this.searchForm.queryAccountId
      }
      if (otherData) {
        Object.assign(reqData, otherData)
      }
      api.apk.queryApks(reqData).then((res) => {
        if (res.data.code === '0') {
          let resData = res.data.data
          this.pageParams.totalSize = resData.totalSize
          this.tableData = resData.resultList
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询apkVersion 通用方法，assign 额外传参
    getApkVersions(otherData) {
      let reqData = {
        apkId: this.versionManageData.curApkId,
        start: this.versionManageData.pageParams.pageID,
        size: this.versionManageData.pageParams.pageSize
      }
      if (otherData) {
        Object.assign(reqData, otherData)
      }
      api.apk.queryApkVersion(reqData).then((res) => {
        if (res.data.code === '0') {
          let resData = res.data.data
          this.versionManageData.pageParams.totalSize = resData.totalSize
          this.versionManageData.versionTableData = resData.resultList
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取机构下拉列表
    getOrgs() {
      let reqData = {
        type: 1
      }
      api.hardware.queryGroup(reqData).then((res) => {
        if (res.data.code === '0') {
          let orgList = res.data.data
          this.orgs = orgList.map((item) => {
            return {
              id: item.accountId,
              value: item.name
            }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 选择建议列表 item: {id,value}
    handleSuggestSelect(item) {
      this.searchForm.apkName = ''
      this.searchForm.queryAccountId = item.id
      this.pageParams.pageID === 1 ? this.getApksList() : this.pageParams.pageID = 1
    },
    // 点击搜索的操作
    searchApks() {
      // 判断通过哪种方式来查询 apkName 还是 机构
      this.searchForm.queryAccountId = ''
      this.searchForm.apkName = ''
      let keyword = this.searchForm.keyword

      if (this.searchForm.type === 1) {
        // by apkName
        this.searchForm.apkName = keyword
        this.pageParams.pageID === 1 ? this.getApksList() : this.pageParams.pageID = 1
      } else {
        // by orgID, 点击建议项目 就触发搜索，此时
        if (!keyword) {
          this.pageParams.pageID === 1 ? this.getApksList() : this.pageParams.pageID = 1
        }
        // 防止手动输入，查询一遍 id
        let validOrg = this.orgs.find((item) => item.value === keyword)
        if (validOrg) {
          this.searchForm.queryAccountId = validOrg.id
          this.pageParams.pageID === 1 ? this.getApksList() : this.pageParams.pageID = 1
        } else {
          this.$message.error('请选中下拉项搜索')
        }
      }
    },
    // 下面的多选按钮触发ele 的全选
    triggerSelctAll() {
      this.elAllSelectDom.click()
    },
    handleTableSelect(selection, row) {
      // 防止不同步bug,
      this.$nextTick(function () {
        let className = this.elAllSelectDom.className
        this.selectAllChecked = className.includes('is-checked') ? true : false
      })
      this.curSelcectBoxes = selection
    },
    handleTableSelectAll(selection) {
      this.curSelcectApks = selection
    },
    // 上下线
    handleOnlineChange(online, apkId) {
      let reqData = {
        apkId: apkId,
        online: online
      }
      api.apk.apkOnline(reqData).then((res) => {
        if (res.data.code !== '0') {
          this.$message.error('APK上下线失败')
        }
      }).catch((err) => {
        console.log('err', err.toString())
        this.$message.error('网络状况不佳')
      })
    },
    // 每页多少条改变
    handleSizeChange(size) {
      this.pageParams.pageSize = size
      this.pageParams.pageID === 1 ? this.getApksList() : this.pageParams.pageID = 1
    },
    // 删除apk 的api
    reqDeleteApks(params) {
      // 过滤掉系统应用
      api.apk.apkDelete(params).then((res) => {
        // 删除部分apk，查询参数改变一下
        if (res.data.code === '21') {
          this.$message.error(res.data.message)
        }
        this.getApksList()
      })
    },
    reqDeleteVersion(params) {
      api.apk.deleteApkVersion(params).then((res) => {
        this.getApkVersions()
      })
    },
    // 删除一个apk
    deleteOneApkDialogOpen(row) {
      let params = [row.id]
      this.deleteDialogVisible = true
      this.curDeleteMethod = this.reqDeleteApks
      this.curDeleteParams = params
    },
    // 点击下方的 删除多个
    deleteAllApksOpen() {
      if (this.curSelcectApks.length) {
        // 改变删除method 和 删除数据 过滤掉系统应用
        let delArr = this.curSelcectApks.map((item) => {
          return item.id
        })
        this.deleteDialogVisible = true
        this.curDeleteMethod = this.reqDeleteApks
        this.curDeleteParams = delArr
      }
    },
    // 点击apk 编辑
    editApkDialogOpen(row, $index) {
      this.editApkVisible = true
      // 记录当前修改的数据索引
      this.curEditIndex = $index
      this.editApkForm = { ...row
      }
      // bind 返回一个新的绑定函数, index 并没有实时传递过去
    },
    editApkDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let reqData = {
            id: this.editApkForm.id,
            name: this.editApkForm.name,
            installWay: this.editApkForm.installWay,
            online: this.editApkForm.online
          }
          api.apk.updateApk(reqData).then((res) => {
            if (res.data.code === '0') {
              this.editApkVisible = false
              // 因为当前row 是数组中的某一项，直接修改响应不到
              this.tableData.splice(this.curEditIndex, 1, this.editApkForm)
            } else {
              this.$message.error('APK编辑失败')
            }
          })
        }
      })
    },
    // 添加apk dialog
    addApkDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.apk.addApk(this.addApkForm).then((res) => {
            if (res.data.code === '0') {
              this.addApkVisible = false
              this.pageParams.pageID === 1 ? this.getApksList() : this.pageParams.pageID = 1
            } else {
              this.$message.error('新增apk失败')
            }
          })
        }
      })
    },
    // 打开版本管理dialog
    versionManageDialogOpen(row, $index) {
      this.versionManageVisible = true
      this.curEditIndex = $index
      // by apkid get info
      this.versionManageData.curApkId = row.id
      this.getApkVersions()
    },
    // 新增和修改 会改变当前版本号
    versionManageDialogCancel() {
      // 将最大版本号的内容回显
      let index = this.curEditIndex
      let versionList = this.versionManageData.versionTableData
      if (versionList.length) {
        this.tableData[index].versionNum = versionList[0].versionNum
      }
    },
    // 新增版本diaolog
    addVersionDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过
          if (!this.addVersionForm.packUrl) {
            return this.$message.warning('请上传安装包')
          }
          this.addVersionVisible = false
          let reqData = Object.assign({
            apkId: this.versionManageData.curApkId
          }, this.addVersionForm)
          api.apk.addApkVersion(reqData).then((res) => {
            if (res.data.code === '0') {
              // 判断页码是否 1 页
              this.getApkVersions()
            } else {
              this.$mesage.error('新增版本失败')
            }
          })
        }
      })
    },
    // 编辑版本dialog打开，传入数据
    alterVersionDialogOpen(row) {
      this.alterApkVersionVisible = true
      this.alterVersionForm = { ...row
      }
    },
    alterVersionDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.alterApkVersionVisible = false
          api.apk.alterApkVersion(this.alterVersionForm).then((res) => {
            if (res.data.code === '0') {
              this.getApkVersions()
            } else {
              this.$mesage.error('修改版本失败')
            }
          })
        }
      })
    },
    // 删除某一版本
    deleteOneVersion(row) {
      // 改变删除method 和 删除数据
      this.deleteDialogVisible = true
      this.curDeleteMethod = this.reqDeleteVersion
      this.curDeleteParams = {
        id: row.id
      }
    },
    // 通用 确定删除 method
    deleteDialogSave() {
      this.deleteDialogVisible = false
      this.curDeleteMethod(this.curDeleteParams)
    },
    // 通用dialog取消，清除表单验证和数据归零
    commonDialogCancel(formName) {
      this.$refs[formName].resetFields()
    },
    commonClearValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    // 点击上传版本文件
    upfileBtnClick() {
      document.querySelector('#J-upfile').click()
    },
    uploadChange(event) {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      api.apk.uploadFile(formData).then((res) => {
        if (res.data.code === '0') {
          if (this.addVersionVisible) {
            this.addVersionForm.packUrl = res.data.data.filePath
          } else {
            this.alterVersionForm.packUrl = res.data.data.filePath
          }
        } else {
          this.$message.error('上传文件失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'index'
</style>
