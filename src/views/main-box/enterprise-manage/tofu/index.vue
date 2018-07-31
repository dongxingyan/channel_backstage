<template lang="html">
<div class="tofu">
  <div class="header">
    <span class="header-title">豆腐块管理</span>
    <div class="search-area">
      <el-autocomplete class="input-area" :fetch-suggestions="querySearchTips" @select="handleSuggestSelect" v-model.trim="searchForm.keyword" placeholder="请输入内容" >
        <el-select popper-class="custom-select" v-model="searchForm.type" slot="prepend">
          <el-option v-for="item in searchForm.options" :key="item.value"
          :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button slot="append">
          <img class="serach-img" @click="searchTofus()" src="../../../../assets/image/enterprise/search.png" alt="">
        </el-button>
      </el-autocomplete>
      <el-button class="btn-gradient-blue" type="text" @click="addTofuVisible = true">新增</el-button>
    </div>
  </div>

  <el-table class="data-table" :data="tableData" @select="handleTableSelect" @select-all="handleTableSelectAll">
    <el-table-column type="selection" :selectable="judgeSelectable" label-class-name="all-select"></el-table-column>
    <el-table-column label="豆腐块名称" prop="name"></el-table-column>
    <el-table-column label="所属" prop="groupName"></el-table-column>
    <el-table-column label="类别" prop="type" :formatter="formatCategory"></el-table-column>
    <el-table-column label="对应APK" prop="apkName"></el-table-column>
    <el-table-column label="状态" width="100px">
      <template slot-scope="{row}" >
        <span class="has-valid" v-if="row.status==1">有效</span>
        <span class="no-valid" v-else>无效</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150px">
      <template slot-scope="{row, $index}">
        <span class="opera" @click="contentManageDialogOpen(row.id)">内容管理</span>
        <span class="opera" @click="editTofuDialogOpen(row, $index)"><img src="../../../../assets/image/enterprise/edit.png" alt=""></span>
        <span class="opera" v-if="row.type!=1" @click="deleteOneTofuOpen(row.id)"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""></span>
      </template>
    </el-table-column>
  </el-table>

  <el-row>
    <el-col :span="8">
      <!-- 全选和分配 -->
      <div class="check-all-container" >
        <el-checkbox class="check-all" v-model="selectAllChecked" label="全选" @click.native="triggerSelctAll()"></el-checkbox>
        <el-button class="delete-btn" type="text" @click="deleteManyTofuOpen()"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""> 删除</el-button>
      </div>
    </el-col>

    <el-col :span="16">
      <!-- 分页 -->
      <el-pagination class="pager-pagination" :total="pageParams.totalSize" :current-page.sync="pageParams.pageID" @current-change="getTofuList" @size-change="handleSizeChange" :page-sizes="[10, 20, 50]" layout="sizes, total, slot, prev, pager, next, jumper">
        <span class="page-size-tip">每页{{pageParams.pageSize}}条</span>
      </el-pagination>
    </el-col>
  </el-row>

  <!-- 编辑豆腐块dialog -->
  <el-dialog title="编辑豆腐块" :visible.sync="editTofuVisible" @close="commonClearValidate('editTofuForm')">
    <el-row>
      <el-col :span="14" :offset="4">
        <el-form ref="editTofuForm" :model="editTofuForm" label-width="120px">
          <el-form-item label="豆腐块名称：" prop="name" :rules="[{required: true, message: '请填写豆腐块名称'}]">
            <el-input v-model.trim="editTofuForm.name" :maxlength="9" placeholder="请填写豆腐块名称"></el-input>
          </el-form-item>
          <el-form-item label="关联APK：" prop="apkId" :rules="[{required: true, message: '请选择关联APK'}]">
            <el-select :disabled="editTofuForm.type==1" v-model="editTofuForm.apkId" placeholder="请选择关联APK" filterable clearable>
              <el-option v-for="item in selectOptions.refApkOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select :disabled="editTofuForm.type==1" v-model="editTofuForm.status" placeholder="请选择状态">
              <el-option v-for="item in selectOptions.statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="editTofuDialogSave('editTofuForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="editTofuVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 添加豆腐块dialog -->
  <el-dialog title="添加豆腐块" custom-class="add-tofu-dialog" :visible.sync="addTofuVisible"
   @close="addTofuDialogCancel('addTofuVisible', 'addTofuForm')">
    <el-row :gutter="40">
      <el-col class="dialog-left-text" :span="6">
        填写相关信息：
      </el-col>
      <el-col :span="12">
        <el-form ref="addTofuForm" :model="addTofuForm" label-width="120px">
          <el-form-item label="关联apk：" prop="apkId" :rules="{required: true, message: '请选择关联apk'}">
            <el-select v-model="addTofuForm.apkId" filterable clearable placeholder="请选择关联apk">
              <el-option v-for="item in selectOptions.refApkOptions" :key="item.id"
              :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="豆腐块名称：" prop="name" :rules="[{required: true, message: '请输入豆腐块名称'},{max: 9, message: '长度不能超过9'}]">
            <el-input v-model.trim="addTofuForm.name" placeholder="请填写豆腐块名称"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table :data="addTofuForm.detailList" border @cell-click="detailCellClick">
      <el-table-column label="标题" header-align="center" label-class-name="first-letter-red">
        <template slot-scope="{row}">
          <el-input v-model.trim="row.title" size="small" :maxlength="8" placeholder="请输入标题"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="副标题" header-align="center" label-class-name="first-letter-red">
        <template slot-scope="{row}">
          <el-input v-model.trim="row.subtitle" size="small" :maxlength="12" placeholder="请输入副标题"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <span class="has-valid">有效</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" >
        <template slot-scope="{row}">
          <input type="file" @change="uploadDetailImg(row, $event)">
          <img :src="row.url | formatImgUrl" v-if="row.url" alt="" width="22px" height="26px" >
          <el-button class="btn-upfile" type="primary" v-else>上传图片</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px" align="center">
        <template slot-scope="{row, $index}">
          <img class="pointer" @click="removeTofuTitle($index)" src="../../../../assets/image/enterprise/delete-red.png" alt="">
        </template>
      </el-table-column>

      <div slot="append" class="tfoot-add">
        <img class="pointer" @click="addTofuDetail()" src="../../../../assets/image/enterprise/add.png" alt="">
      </div>
    </el-table>

    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="addTofuDialogSave('addTofuForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="addTofuVisible=false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 内容管理Dialog -->
  <el-dialog title="内容管理" :visible.sync="contentManageVisible" >
    <el-table :data="detailDialogData.beanCurdCubeDtails" border :max-height="350">
      <el-table-column label="序号" align="center" width="50px" prop="sort">
      </el-table-column>
      <el-table-column label="标题" prop="title">
      </el-table-column>
      <el-table-column label="副标题" prop="subtitle">
      </el-table-column>
      <el-table-column label="状态" width="80px" align="center">
        <template slot-scope="{row}">
          <span class="has-valid" v-if="row.status==1">有效</span>
          <span class="no-valid" v-else>无效</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="50px">
        <template slot-scope="{row}">
          <img :src="row.url | formatImgUrl" alt="" width="22px" height="26px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70px" align="center">
        <template slot-scope="{row}">
          <div class="operation-area">
            <span class="opera" @click="alterDetailDialogOpen(row)"><img src="../../../../assets/image/enterprise/edit.png" alt=""></span>
            <span class="opera" @click="delDetailDialogOpen(row.id)"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""></span>
          </div>
        </template>
      </el-table-column>
      <div slot="append" class="tfoot-add">
        <img class="pointer" @click="addDetailDialogOpen()" src="../../../../assets/image/enterprise/add.png" alt="">
      </div>
    </el-table>
  </el-dialog>

  <!-- 内容管理新增 -->
  <el-dialog title="新增" custom-class="add-edit-dialog" :visible.sync="detailAddVisible" @close="commonDialogCancel('detailAddForm')">
    <el-row>
      <el-col :span="6">
        <span class="dialog-left-text">填写相关信息：</span>
      </el-col>
      <el-col :span="11">
        <el-form ref="detailAddForm" :rules="addOrEditFormRules" :model="detailAddForm" label-width="100px">
          <el-form-item label="顺序：" prop="sort">
            <el-input v-model.trim.number="detailAddForm.sort" placeholder="请填写顺序"></el-input>
          </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model.trim="detailAddForm.title" :maxlength="8" placeholder="请填写标题"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" prop="subtitle">
            <el-input v-model.trim="detailAddForm.subtitle" :maxlength="12" placeholder="请填写副标题"></el-input>
          </el-form-item>
          <el-form-item label="首屏内容图：" prop="url">
            <img :src="detailAddForm.url | defaultImgUrl" alt="" width="68px" height="90px">
            <el-button class="btn-upfile" type="primary" @click="upfileBtnClick()">选择文件</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="addDetailDialogSave('detailAddForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="detailAddVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 内容管理编辑 -->
  <el-dialog title="编辑" custom-class="add-edit-dialog" :visible.sync="detailAlterVisible" @close="commonClearValidate('detailAlterForm')">
    <el-row>
      <el-col :span="6">
        <span class="dialog-left-text">填写相关信息：</span>
      </el-col>
      <el-col :span="11">
        <el-form ref="detailAlterForm" :rules="addOrEditFormRules" :model="detailAlterForm" label-width="100px">
          <el-form-item label="顺序：" prop="sort">
            <el-input v-model.trim.number="detailAlterForm.sort" placeholder="请填写顺序"></el-input>
          </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model.trim="detailAlterForm.title" :maxlength="8" placeholder="请填写标题"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" prop="subtitle">
            <el-input v-model.trim="detailAlterForm.subtitle" :maxlength="12" placeholder="请填写副标题"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select :disabled="detailAlterForm.type==1" v-model="detailAlterForm.status" placeholder="请选择状态">
              <el-option v-for="item in selectOptions.statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="首屏内容图：" prop="url">
            <img :src="detailAlterForm.url | defaultImgUrl" alt="" width="68px" height="90px">
            <el-button class="btn-upfile" type="primary" @click="upfileBtnClick()">选择文件</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="editDetailDialogSave('detailAlterForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="detailAlterVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 删除提示dialog -->
  <el-dialog class="delete-boxes-dialog" title="提示" width="400px" :visible.sync="deleteVisible">
    <div class="delete-tip">
      删除之后不可恢复，确定删除？
    </div>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="commonDeleteDialogSave()">确定</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="deleteVisible=false">取消</el-button>
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

export default {
  name: 'TofuManage',
  data() {
    let searchOptions = [{
      label: '豆腐块名称',
      value: 1
    }, {
      label: '所属',
      value: 2
    }, {
      label: '类别',
      value: 3
    }]
    let statusOptions = [{
      label: '有效',
      value: 1
    }, {
      label: '无效',
      value: 2
    }]
    // type 1.系统，2渠道，3机构
    let classesOptions = [{
      value: '系统应用',
      id: 1
    }, {
      value: '渠道定制',
      id: 2
    }, {
      value: '机构定制',
      id: 3
    }]

    let validateSort = (rule, value, cb) => {
      // 因为值没有在data 里面声明赋值，
      if (value === '' || value === undefined) {
        cb(Error('请填写顺序'))
      } else if (/^[1-9]\d*$/.test(value)) {
        cb()
      } else {
        cb(Error('顺序必须为大于0的数字'))
      }
    }

    let addOrEditFormRules = {
      sort: [{
        required: true,
        validator: validateSort
      }],
      title: [{
        required: true,
        message: '请填写标题'
      }],
      subtitle: [{
        required: true,
        message: '请填写副标题'
      }]
    }

    return {
      orgs: [],
      selectAllChecked: false, // 自定义全选按钮状态
      elAllSelectDom: {}, // element table 全选 dom
      curSelcectTofus: [], // 当前选中的列表项目
      curDeleteMethod: '',
      curDeleteParams: '',
      addOrEditFormRules: addOrEditFormRules,
      searchForm: {
        keyword: '',
        type: 1, // 搜索的类型
        options: searchOptions // 搜索下拉项
      },
      // 下拉菜单的 选择项
      selectOptions: {
        statusOptions: statusOptions, // 状态，有效无效
        refApkOptions: [], // 关联apks
        classesOptions: classesOptions // 类别 下拉框，系统，渠道，机构
      },
      tableData: [],
      pageParams: {
        pageID: 1,
        pageSize: 10,
        totalSize: 0
      },
      editTofuForm: {
        name: '',
        apkId: '',
        status: ''
      },
      addTofuForm: {
        apkId: '',
        name: '',
        detailList: [{
          title: '',
          subtitle: '',
          url: ''
        }]
      },
      // 内容管理dialog 内容
      detailDialogData: {
        beanCurdCube: {
          id: ''
        },
        beanCurdCubeDtails: [{

        }]
      },
      detailAddForm: {
        url: ''
      },
      detailAlterForm: {
        url: ''
      },
      // 内容管理中 编辑和新增dialog确定 点击事件函数
      addTofuVisible: false,
      editTofuVisible: false,
      contentManageVisible: false,
      deleteVisible: false,
      detailAddVisible: false,
      detailAlterVisible: false,
      curEditIndex: ''
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
  created() {
    // 其他函数涉及到 操作dom 都将其缓存下来
    this.getTofuList()
    this.getOrgs()
    this.getRefApks()
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
    // 点击上传版本文件
    upfileBtnClick() {
      document.querySelector('#J-upfile').click()
    },
    uploadChange(event) {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      api.tofu.uploadFile(formData).then((res) => {
        if (res.data.code === '0') {
          if (this.detailAddVisible) {
            this.detailAddForm.url = res.data.data.filePath
          } else {
            this.detailAlterForm.url = res.data.data.filePath
          }
        } else {
          this.$message.error('上传失败')
        }
      })
    },
    // 表格中的上传图片
    uploadDetailImg(row, event) {
      let formData = new FormData()
      formData.append('file', event.target.files[0])
      api.tofu.uploadFile(formData).then((res) => {
        if (res.data.code === '0') {
          row.url = res.data.data.filePath
        } else {
          this.$message.error('上传失败')
        }
      })
    },
    // 判断系统应用前方的不可选中
    judgeSelectable(row, index) {
      return row.type > 1 ? true : false
    },
    // 这是表格中所有cell dom 都会触发，需要判断图片上传
    detailCellClick(row, column, cell, event) {
      if (column.label === '图片') {
        // 图片这一列的点击, 触发file input
        cell.firstChild.firstChild.click()
      }
    },
    // 通用dialog取消，清除表单验证和数据归零
    commonDialogCancel(formName) {
      this.$refs[formName].resetFields()
    },
    commonClearValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    addOrEditDialogCancel(formName) {
      // 由于 修改和新增detail 用同一个dialog， 存在resetField导致验证问题
      this.$refs[formName].resetFields()
      Object.assign(this.addOrEditForm, {
        sort: '',
        title: '',
        subtitle: '',
        url: '',
        status: ''
      })
    },
    // 选择建议列表 item: {id,value}
    handleSuggestSelect(item) {
      let type = this.searchForm.type
      this.searchForm.name = ''
      this.searchForm.queryAccountId = ''
      this.searchForm.classesId = ''
      switch (type) {
        case 2:
          // by org
          this.searchForm.queryAccountId = item.id
          this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
          break
        default:
          // by 类别
          this.searchForm.classesId = item.id
          this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
      }
    },
    searchTofus() {
      // 判断通过哪种方式来查询 tofu 还是 机构
      let type = this.searchForm.type
      let keyword = this.searchForm.keyword
      this.searchForm.name = ''
      this.searchForm.queryAccountId = ''
      this.searchForm.classesId = ''
      if (!keyword) {
        this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
        return
      }
      switch (type) {
        case 1:
          // by tofu
          this.searchForm.name = keyword
          this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
          break
        case 2:
          // by org
          let validOrg = this.orgs.find((item) => item.value === keyword)
          if (validOrg) {
            this.searchForm.queryAccountId = validOrg.id
            this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
          } else {
            this.$message.error('请选择下拉项搜索')
          }
          break
        default:
          // by 类别
          let validClass = this.selectOptions.classesOptions.find((item) => item.value === keyword)
          if (validClass) {
            this.searchForm.classesId = validClass.id
            this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
          } else {
            this.$message.warning('请选择下拉项搜索')
          }
      }
    },
    // 下拉列表模糊查询筛选方法
    querySearchTips(queryString, cb) {
      queryString = this.searchForm.keyword
      // 区分开 tofu 还是机构
      let type = this.searchForm.type
      if (type == 1) {
        // by apkName
        let arr = []
        cb(arr)
      } else if (type == 2) {
        // by org
        let orgs = this.orgs
        let results = queryString ? orgs.filter((item) => {
          if (item.value.includes(queryString)) {
            return true
          }
        }) : orgs
        cb(results)
      } else {
        // by 类别
        cb(this.selectOptions.classesOptions)
      }
    },
    // 每页多少条改变
    handleSizeChange(size) {
      this.pageParams.pageSize = size
      this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
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
      this.curSelcectTofus = selection
    },
    formatCategory(row, column, cellValue) {
      if (cellValue === 1) {
        return '系统应用'
      } else if (cellValue === 2) {
        return '渠道定制'
      } else {
        return '机构定制'
      }
    },
    // 获取豆腐块列表
    getTofuList(otherData) {
      this.selectAllChecked = false
      let reqData = {
        start: this.pageParams.pageID,
        size: this.pageParams.pageSize,
        name: this.searchForm.name,
        queryAccountId: this.searchForm.queryAccountId,
        type: this.searchForm.classesId // 类别： 1,2,3： 系统，渠道，机构
      }
      if (otherData) {
        Object.assign(reqData, otherData)
      }
      api.tofu.queryTofus(reqData).then((res) => {
        if (res.data.code === '0') {
          let resData = res.data.data
          this.pageParams.totalSize = resData.totalSize
          this.tableData = resData.resultList
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
        }
      }).catch((err) => {
        this.$message.error(err.toString())
      })
    },
    // 查询当前渠道和所有渠道下机构的apk
    getRefApks() {
      api.tofu.queryRefApks({}).then((res) => {
        if (res.data.code === '0') {
          this.selectOptions.refApkOptions = res.data.data
        }
      })
    },
    // 豆腐块批量删除,需要传入一个id数组，[1,2,3]
    reqDeleteTofus(delArray) {
      api.tofu.deleteTofus(delArray).then((res) => {
        if (res.data.code === '0') {
          this.deleteVisible = false
          this.getTofuList()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    // 内容管理中删除豆腐块详情
    reqDeleteTofuDetail(params) {
      api.tofu.deleteTofuDetail(params).then((res) => {
        if (res.data.code === '0') {
          this.deleteVisible = false
          this.getTofuDetails(params.tofuId)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    editTofuDialogOpen(row, $index) {
      this.editTofuVisible = true
      this.curEditIndex = $index
      this.editTofuForm = { ...row
      }
    },
    editTofuDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editTofuVisible = false
          let editTofuForm = this.editTofuForm
          let apkId = editTofuForm.apkId
          let reqData = {
            id: editTofuForm.id,
            apkId: apkId,
            name: editTofuForm.name,
            status: editTofuForm.status
          }
          let validApk = this.selectOptions.refApkOptions.find((item) => item.id === apkId)
          let backData = Object.assign({}, editTofuForm, {
            apkName: validApk.name
          })
          // 由于数据更改由前端页面更改， 需要得到改变后apkName.
          api.tofu.alterTofu(reqData).then((res) => {
            if (res.data.code === '0') {
              this.tableData.splice(this.curEditIndex, 1, backData)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    addTofuDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            this.addTofuForm.detailList.forEach((item) => {
              if (!(item.title && item.subtitle && item.url)) {
                throw Error()
              }
            })
          } catch (e) {
            return this.$message.warning('请完善相关信息')
          }
          this.addTofuVisible = false
          let reqData = this.addTofuForm
          reqData.detailList.forEach((item, index) => {
            item.sort = index + 1
          })
          api.tofu.addTofu(reqData).then((res) => {
            if (res.data.code === '0') {
              this.pageParams.pageID === 1 ? this.getTofuList() : this.pageParams.pageID = 1
            } else {
              this.$message.error('新增豆腐块失败')
            }
          })
        }
      })
    },
    addTofuDialogCancel(visibleName, formName) {
      let arr = this.addTofuForm.detailList
      this.$data[visibleName] = false
      this.$refs[formName].resetFields()
      arr.splice(0, arr.length, {
        title: '',
        subtitle: '',
        url: ''
      })
    },
    // 新增豆腐块中 移除某一项，
    removeTofuTitle(index) {
      this.addTofuForm.detailList.splice(index, 1)
    },
    addTofuDetail() {
      this.addTofuForm.detailList.push({
        title: '',
        subtitle: '',
        url: ''
      })
    },
    // 打开内容管理获取的列表
    getTofuDetails(tofuId) {
      let reqData = {
        beanCurdCubeId: tofuId
      }
      api.tofu.queryTofuDetail(reqData).then((res) => {
        if (res.data.code === '0') {
          this.detailDialogData = res.data.data
        }
      })
    },
    // 打开内容管理diaolog,by id get list
    contentManageDialogOpen(id) {
      this.contentManageVisible = true
      this.getTofuDetails(id)
    },
    // 内容管理中添加 记录
    addDetailDialogOpen() {
      this.detailAddVisible = true
    },
    addDetailDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = this.detailAddForm
          let reqData = {
            ...this.detailAddForm
          }
          let tofuId = this.detailDialogData.beanCurdCube.id
          let urlData = {
            beanCurdCubeId: tofuId
          }
          api.tofu.addTofuDetail(reqData, urlData).then((res) => {
            if (res.data.code === '0') {
              this.detailAddVisible = false
              this.getTofuDetails(tofuId)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    // 内容管理中修改某一条记录
    alterDetailDialogOpen(row) {
      this.detailAlterVisible = true
      this.detailAlterForm = { ...row
      }
    },
    editDetailDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = this.detailAlterForm
          let reqData = {
            id: form.id,
            sort: form.sort,
            title: form.title,
            subtitle: form.subtitle,
            url: form.url,
            status: form.status
          }
          let tofuId = this.detailDialogData.beanCurdCube.id
          let urlData = {
            beanCurdCubeId: tofuId
          }
          api.tofu.alterTofuDetail(reqData, urlData).then((res) => {
            if (res.data.code === '0') {
              this.detailAlterVisible = false
              this.getTofuDetails(tofuId)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    // 通用删除dialog 点击确定，执行删除,取消弹出框不在此判断
    commonDeleteDialogSave() {
      this.curDeleteMethod(this.curDeleteParams)
    },
    // 删除一个豆腐块diaolog 打开，改变当前删除方法和参数
    deleteOneTofuOpen(id) {
      this.deleteVisible = true
      this.curDeleteMethod = this.reqDeleteTofus
      this.curDeleteParams = [id]
    },
    // 删除多个, map 新数组
    deleteManyTofuOpen() {
      if (this.curSelcectTofus.length) {
        this.deleteVisible = true
        this.curDeleteMethod = this.reqDeleteTofus
        this.curDeleteParams = this.curSelcectTofus.map((item) => item.id)
      }
    },
    // 删除豆腐块详情
    delDetailDialogOpen(detailId) {
      this.deleteVisible = true
      this.curDeleteMethod = this.reqDeleteTofuDetail
      this.curDeleteParams = {
        tofuId: this.detailDialogData.beanCurdCube.id,
        detailId: detailId
      }
    }
  }
}
</script>

<style lang="scss">
@import 'index'
</style>
