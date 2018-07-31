<template lang="html">
<div class="boxes">
  <div class="header">
    <span class="header-title">硬件管理</span>
    <div class="search-area">
      <el-autocomplete :fetch-suggestions="querySearchTips" @select="handleSuggestSelect"
       class="input-area" v-model.trim="searchForm.keyword" placeholder="请输入内容" >
        <el-select v-model="searchForm.type" slot="prepend" popper-class="custom-select">
          <el-option v-for="item in searchForm.options" :key="item.value"
          :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button slot="append">
          <img class="serach-img" @click="searchBoxes()" src="../../../../assets/image/enterprise/search.png" alt="">
        </el-button>
      </el-autocomplete>
      <el-button class="btn-gradient-blue" type="text" @click="addBoxVisible = true">盒子添加</el-button>
      <el-button class="btn-gradient-blue" type="text" @click="excelImportVisible = true">Excel导入</el-button>
    </div>
  </div>

  <el-table class="data-table" :data="tableData" @select="handleTableSelect" @select-all="handleTableSelectAll">
    <el-table-column type="selection" label-class-name="all-select"></el-table-column>
    <el-table-column type="index" label="盒子序号" width="80px" :index="calcIndex"></el-table-column>
    <el-table-column label="MAC" prop="mac"></el-table-column>
    <el-table-column label="SN" prop="sn"></el-table-column>
    <el-table-column label="所属渠道" prop="channelName"></el-table-column>
    <el-table-column label="所属机构" prop="orgName"></el-table-column>
    <el-table-column label="操作" width="150px">
      <template slot-scope="{row, $index}">
        <span class="opera hover-blue" @click="editBoxDialogOpen(row, $index)"><img src="../../../../assets/image/enterprise/edit.png" alt=""> 编辑</span>
        <span class="opera hover-red" @click="deleteOneBoxOpen(row.id)"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""> 删除</span>
      </template>
    </el-table-column>
  </el-table>

  <el-row>
    <el-col :span="8">
      <!-- 全选和分配 -->
      <div class="check-all-container" >
        <el-checkbox class="check-all" v-model="selectAllChecked" label="全选" @click.native="triggerSelctAll()"></el-checkbox>
        <el-button class="dispatch-btn" type="text" @click="dispatchBoxesDialogOpen()"><img src="../../../../assets/image/enterprise/dispatch.png" alt=""> 分配</el-button>
        <el-button class="delete-btn" type="text" @click="deleteManyBoxesOpen()"><img src="../../../../assets/image/enterprise/delete-red.png" alt=""> 删除</el-button>
      </div>
    </el-col>

    <el-col :span="16">
      <!-- 分页 -->
      <el-pagination class="pager-pagination" :total="pageParams.totalSize" :current-page.sync="pageParams.pageID" @current-change="getBoxesList" @size-change="handleSizeChange" :page-sizes="[10, 20, 50]" layout="sizes, total, slot, prev, pager, next, jumper">
        <span class="page-size-tip">每页{{pageParams.pageSize}}条</span>
      </el-pagination>
    </el-col>
  </el-row>

  <!-- 编辑盒子Dialog -->
  <el-dialog class="edit-boxes-dialog" title="编辑盒子" :visible.sync="editBoxesVisible">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-form status-icon ref="editBoxForm" :rules="editBoxDialogRules" :model="editBoxForm" label-width="80px">
          <el-form-item label="MAC：" prop="mac">
            <el-input v-model.trim="editBoxForm.mac" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="SN：" prop="sn">
            <el-input v-model.trim="editBoxForm.sn" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="机构：">
            <el-select v-model="editBoxForm.orgId" placeholder="请选择机构" filterable clearable>
              <el-option v-for="item in orgs" :key="item.id"
              :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="editBoxDialogSave('editBoxForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="editBoxesVisible=false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 添加盒子Dialog -->
  <el-dialog class="add-box-dialog" title="添加盒子" :visible.sync="addBoxVisible" @close="commonDialogCancel('addBoxForm')">
   <el-form status-icon ref="addBoxForm" :model="addBoxForm" label-width="70px">
    <el-row :gutter="40">
      <el-col class="dialog-left-text" :span="6">选择相关信息：</el-col>
      <el-col :span="12">
          <el-form-item label="机构：" prop="orgId" :rules="{required: true, message: '请选择机构'}">
            <el-select v-model="addBoxForm.orgId" placeholder="请选择机构" filterable clearable>
              <el-option v-for="item in orgs" :key="item.id"
              :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="40">
      <el-col class="dialog-left-text" :span="6">填写相关信息：</el-col>
      <el-col :span="16">
        <el-table class="add-boxes-table" :data="addBoxForm.boxesInfo" border >
          <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
          <el-table-column label="MAC" header-align="center" label-class-name="first-letter-red">
              <template slot-scope="{row}">
                <el-input v-model.trim="row.mac" size="small" placeholder="请输入MAC"></el-input>
              </template>
          </el-table-column>
          <el-table-column label="SN" header-align="center" label-class-name="first-letter-red">
            <template slot-scope="{row}">
              <el-input v-model.trim="row.sn" size="small" placeholder="请输入SN"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="50px" align="center">
              <template slot-scope="{$index}">
                <img @click="removeRowBox($index)" class="pointer" src="../../../../assets/image/enterprise/delete-gray.png" alt="">
              </template>
          </el-table-column>
          <div slot="append" class="tfoot-add">
              <img @click="addRowBox()" class="pointer" src="../../../../assets/image/enterprise/add.png" alt="">
            </div>
        </el-table>
      </el-col>
    </el-row>
    </el-form>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="addBoxDialogSave('addBoxForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="addBoxVisible = false">取消</el-button>
    </div>
  </el-dialog>

  <!-- excel导入Dialog -->
  <el-dialog class="excel-import-dialog" title="Excel导入" :visible.sync="excelImportVisible"
   @close="commonDialogCancel('excelImportForm')">
    <el-row :gutter="40">
      <el-col class="dialog-left-text" :span="6"><span>选择相关信息：</span></el-col>
      <el-col :span="12">
        <el-form status-icon ref="excelImportForm" :model="excelImportForm" label-width="70px">
          <el-form-item label="机构：" prop="orgId" :rules="{required: true, message: '请选择机构'}">
            <el-select v-model="excelImportForm.orgId" placeholder="请选择机构" filterable clearable>
              <el-option v-for="item in orgs" :key="item.id"
              :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row class="import-file" :gutter="40">
      <el-col class="dialog-left-text" :span="6">选择导入文件：</el-col>
      <el-col :span="18">
        <el-button class="btn-upfile" type="primary" @click="upfileBtnClick()">选择文件</el-button>
      </el-col>
    </el-row>

    <div class="valid-info" v-show="excelImportForm.validCount">
      <span class="">选中有效信息{{excelImportForm.validCount}}条</span>
    </div>

    <el-row class="import-descr" :gutter="40">
      <el-col class="dialog-left-text" :span="6">导入说明：</el-col>
      <el-col :span="18">
        <p>1.请使用Excel等软件创建一个XLS或XLSX文件、格式如下</p>
        <el-row :gutter="10" type="flex" justify="start" align="middle">
          <el-col :span="16">
            <img src="../../../../assets/image/enterprise/excel-template.png" alt="" width="100%">
          </el-col>
          <el-col :span="8">
            <a :href="templateUrl">下载模板</a>
          </el-col>
        </el-row>
        <p>2.各列内容：MAC（必填），SN（必填）</p>
      </el-col>
    </el-row>

    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text"
       @click="excelImportDialogSave('excelImportForm')">导入</el-button>
      <el-button class="btn-gradient-orange" type="text"
       @click="excelImportVisible=false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 分配盒子Dialog -->
  <el-dialog class="dispatch-boxes-dialog" title="分配盒子" :visible.sync="dispatchBoxesVisible"
   @close="commonDialogCancel('dispatchBoxesForm')">
    <el-row :gutter="40">
      <el-col class="gray-text" :span="6">选中盒子信息：</el-col>
    </el-row>

    <el-table class="dispatch-boxes-table" :data="dispatchBoxesForm.boxesInfo" :max-height="300" header-row-class-name="dialog-table-thead" border >
      <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column label="MAC" prop="mac" header-align="center" align="center" label-class-name="first-letter-red"></el-table-column>
      <el-table-column label="SN" prop="sn" header-align="center" align="center" label-class-name="first-letter-red"></el-table-column>
      <el-table-column label="渠道" prop="channelName" header-align="center" align="center"></el-table-column>
      <el-table-column label="机构" prop="orgName" header-align="center" align="center"></el-table-column>
    </el-table>
    <br>
    <el-row :gutter="40">
      <el-col :span="6"><span class="gray-text">分配：</span></el-col>
      <el-col :span="12">
        <el-form status-icon ref="dispatchBoxesForm" :model="dispatchBoxesForm" label-width="70px">
          <el-form-item label="机构：" prop="orgId" :rules="{required: true, message: '请选择机构'}">
            <el-select v-model="dispatchBoxesForm.orgId" placeholder="请选择机构" filterable clearable>
              <el-option v-for="item in orgs" :key="item.id"
              :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="dispatchBoxesDialogSave('dispatchBoxesForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="dispatchBoxesVisible=false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 删除提示dialog -->
  <el-dialog class="delete-boxes-dialog" title="提示" width="400px" :visible.sync="deleteDialogVisible">
    <div class="delete-tip">
      删除之后不可恢复，确定删除？
    </div>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="commonDeleteDialogSave()">确定</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="deleteDialogVisible=false">取消</el-button>
    </div>
  </el-dialog>

  <input type="file" id="J-excel-input" @change="uploadChange($event)">
</div>
</template>

<script>
import api from 'api/index'
import {
  apiServer
} from 'configuration/index'
export default {
  name: 'BoxesManage',
  data() {
    let searchOptions = [{
      label: 'MAC/SN',
      value: 1
    }, {
      label: '所属机构',
      value: 2
    }]

    let editBoxDialogRules = {
      mac: [{
        required: true,
        message: '请输入MAC码'
      }],
      sn: [{
        required: true,
        message: '请输入SN码'
      }]
    }

    return {
      accountId: sessionStorage.getItem('accountId'),
      orgs: '', // 开通企事通的所有机构
      templateUrl: `${apiServer}/cloudpServer/file/xls/boxes.xls`,
      editBoxDialogRules: editBoxDialogRules,
      curDeleteMethod: '',
      curDeleteParams: '',
      curSelcectBoxes: [], // 当前选中的boxes
      selectAllChecked: false, // 自定义的全选按钮是否选中,
      elAllSelectDom: {}, // element table 全选 dom
      searchForm: {
        keyword: '',
        type: 1, // 搜索的类型, mac or org : 1,2
        options: searchOptions, // 搜索下拉项
        orgId: '', // 查询字段orgID
        macSN: '' // 查询字段 mac 值
      },
      tableData: [],
      pageParams: {
        pageID: 1,
        pageSize: 10,
        totalSize: 0
      },
      editBoxForm: {
        mac: '',
        sn: '',
        org: ''
      },
      addBoxForm: {
        orgId: '',
        boxesInfo: [{}]
      },
      excelImportForm: {
        orgId: '',
        filePath: '',
        validCount: '' // 模板有效数据
      },
      dispatchBoxesForm: {
        orgId: '',
        boxesInfo: []
      },
      addBoxVisible: false,
      excelImportVisible: false,
      dispatchBoxesVisible: false,
      editBoxesVisible: false,
      deleteDialogVisible: false,
      addBoxesData: [{
        mac: 'mac'
      }],
      curEditIndex: ''
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.elAllSelectDom = document.querySelector('.cell.all-select .el-checkbox')
      // 点击建议框 清空内容
      document.querySelector('.input-area>div>input').addEventListener('focusin', () => {
        this.searchForm.keyword = ''
      })
    })
  },
  computed: {
    baseIndex() {
      return (this.pageParams.pageID - 1) * this.pageParams.pageSize + 1
    }
  },
  created() {
    this.getBoxesList()
    // 缓存当前渠道下的所有机构，以免重复请求接口
    this.getOrgs()
  },
  methods: {
    calcIndex(index) {
      return this.baseIndex + index
    },
    // 点击上传文件
    upfileBtnClick() {
      document.querySelector('#J-excel-input').click()
    },
    uploadChange(event) {
      let file = event.target.files[0]
      let fileName = file.name
      let fileNameArr = fileName.split('.')
      let suffix = fileNameArr[fileNameArr.length - 1].toLowerCase()
      if (suffix !== 'xls' && suffix !== 'xlsx') {
        event.target.value = ''
        return this.$message.error('请选择xls或xlsx类型的文件')
      }
      let formData = new FormData()
      formData.append('file', file)
      api.boxesManage.uploadExcel(formData).then((res) => {
        if (res.data.code === '0') {
          this.excelImportForm.validCount = res.data.data.count
          this.excelImportForm.filePath = res.data.data.filePath
        }
      })
      event.target.value = ''
    },
    // 删除盒子接口
    reqDeleteBoxes(delArray) {
      api.boxesManage.deleteBoxes(delArray).then((res) => {
        if (res.data.code === '0') {
          this.deleteDialogVisible = false
          this.getBoxesList()
        }
      })
    },
    /**
     * [通用dialog取消，清除表单验证和数据归零]
     * @param  {[string]} formName  [el-form 上的 ref属性]
     * @param  {[string]} formModel [el-form 上的 model属性]
     */
    commonDialogCancel(formName, formModel) {
      this.$refs[formName].resetFields()
      let form = this.$data[formModel || formName]
      // 针对于 form 上的 数组的 只能恢复到长度相等，并不能内部数据清零
      for (let arr of Object.values(form)) {
        if ((arr instanceof Array) && arr.length) {
          let obj = arr[0]
          for (let [key, value] of Object.entries(obj)) {
            obj[key] = ''
          }
          // 这样的目的是为了让obj上的属性被响应，还有setter，getter
          arr.splice(0, arr.length, { ...obj
          })
        }
      }
      // 针对上传excel form 数据
      if (this.$data[formName].validCount) {
        this.$data[formName].validCount = ''
        this.$data[formName].filePath = ''
      }
    },
    // 通用删除dialog 点击确定，执行删除,取消弹出框不在此判断
    commonDeleteDialogSave() {
      this.curDeleteMethod(this.curDeleteParams)
    },
    // 查询 box所有列表，制作两个方案， 一个通用，一个参数对象合并
    getBoxesList(otherData) {
      this.selectAllChecked = false
      let reqData = {
        start: this.pageParams.pageID,
        size: this.pageParams.pageSize,
        channelId: sessionStorage.getItem('channelId'),
        keyword: this.searchForm.macSN,
        orgId: this.searchForm.orgId
      }
      if (otherData) {
        Object.assign(reqData, otherData)
      }
      api.boxesManage.queryBoxes(reqData).then(res => {
        let resData = res.data.data
        this.tableData = resData.resultList
        this.pageParams.totalSize = resData.totalSize
      }).catch(err => {
        this.$message.error(err.toString())
      })
    },
    // 获取机构下拉列表
    getOrgs() {
      let reqData = {
        type: 3,
        isBox: 1
      }
      api.hardware.queryGroup(reqData).then((res) => {
        if (res.data.code === '0') {
          let orgList = res.data.data
          this.orgs = orgList.map((item) => {
            return {
              id: item.orgId,
              value: item.name
            }
          })
        }
      }).catch((err) => {
        this.$message.error(err.toString())
      })
    },
    // 下拉列表模糊查询方法
    querySearchTips(queryString, cb) {
      queryString = this.searchForm.keyword
      // 区分开 mac 还是机构
      if (this.searchForm.type == 1) {
        // by mac
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
      this.curSelcectBoxes = selection
    },
    // 每页多少条改变
    handleSizeChange(size) {
      this.pageParams.pageSize = size
      this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
    },
    // 选择建议列表 item: {id,value}
    handleSuggestSelect(item) {
      this.searchForm.macSN = ''
      this.searchForm.orgId = item.id
      this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
    },
    // 通过搜索框点击查询
    searchBoxes() {
      // 判断是通过什么查询的
      let keyword = this.searchForm.keyword
      this.searchForm.macSN = ''
      this.searchForm.orgId = ''
      if (this.searchForm.type === 1) {
        // by macsn
        this.searchForm.macSN = keyword
        this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
      } else {
        // by org
        if (!keyword) {
          this.searchForm.orgId = ''
          this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
          return
        }
        let validOrg = this.orgs.find((item) => item.value === keyword)
        if (validOrg) {
          this.searchForm.orgId = validOrg.id
          this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
        } else {
          this.$message.warning('请选择下拉项搜索')
        }
      }
    },
    editBoxDialogOpen(row, $index) {
      this.editBoxesVisible = true
      this.curEditIndex = $index
      this.editBoxForm = { ...row
      }
    },
    editBoxDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editBoxForm.mac = this.editBoxForm.mac.toUpperCase()
          this.editBoxForm.sn = this.editBoxForm.sn.toUpperCase()
          let reqData = {
            id: this.editBoxForm.id,
            mac: this.editBoxForm.mac,
            sn: this.editBoxForm.sn,
            orgId: this.editBoxForm.orgId
          }
          let selectOrgName = this.orgs.find((item) => item.id === this.editBoxForm.orgId).value
          api.boxesManage.updateBox(reqData).then((res) => {
            if (res.data.code === '0') {
              this.editBoxesVisible = false
              let newRow = Object.assign({}, this.editBoxForm, {
                orgName: selectOrgName
              })
              this.tableData.splice(this.curEditIndex, 1, newRow)
            } else {
              this.$message.error('编辑盒子失败')
            }
          })
        }
      })
    },
    // 添加盒子dialog 加一行
    addRowBox() {
      this.addBoxForm.boxesInfo.push({})
    },
    // 添加盒子dialog 减少一行
    removeRowBox(index) {
      this.addBoxForm.boxesInfo.splice(index, 1)
    },
    addBoxDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            this.addBoxForm.boxesInfo.forEach((item) => {
              if (!(item.mac && item.sn)) {
                throw Error()
              }
              item.mac = item.mac.toUpperCase()
              item.sn = item.sn.toUpperCase()
            })
          } catch (e) {
            return this.$message.warning('请完善相关信息')
          }
          this.addBoxVisible = false
          let reqData = JSON.parse(JSON.stringify(this.addBoxForm.boxesInfo))
          let urlParams = {
            orgId: this.addBoxForm.orgId
          }
          api.boxesManage.addBox(reqData, urlParams).then((res) => {
            if (res.data.code === '0') {
              this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
            } else {
              this.$message.error('新增盒子失败')
            }
          })
        }
      })
    },
    excelImportDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let excelData = this.excelImportForm
          if (!excelData.validCount) {
            return this.$message.warning('请导入模板文件')
          }
          this.excelImportVisible = false
          let req = {
            orgId: excelData.orgId,
            filePath: excelData.filePath
          }
          api.boxesManage.importBoxes(req).then((res) => {
            if (res.data.code === '0') {
              this.$message.success('导入盒子成功')
              this.pageParams.pageID === 1 ? this.getBoxesList() : this.pageParams.pageID = 1
            } else {
              this.$message.error('导入盒子失败')
            }
          })
        }
      })
    },
    deleteOneBoxOpen(boxId) {
      this.deleteDialogVisible = true
      this.curDeleteMethod = this.reqDeleteBoxes
      this.curDeleteParams = [{
        id: boxId
      }]
    },
    deleteManyBoxesOpen() {
      if (this.curSelcectBoxes.length) {
        this.deleteDialogVisible = true
        this.curDeleteMethod = this.reqDeleteBoxes
        let delArr = this.curSelcectBoxes.map((item) => ({
          id: item.id
        }))
        this.curDeleteParams = delArr
      }
    },
    dispatchBoxesDialogOpen() {
      if (this.curSelcectBoxes.length) {
        this.dispatchBoxesVisible = true
        let selectBoxes = this.curSelcectBoxes
        this.dispatchBoxesForm.boxesInfo = JSON.parse(JSON.stringify(selectBoxes))
      }
    },
    dispatchBoxesDialogSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let reqData = this.curSelcectBoxes.map((item) => {
            return item.id
          })
          let pathParams = {
            orgId: this.dispatchBoxesForm.orgId
          }
          api.boxesManage.dispatchBoxes(reqData, pathParams).then((res) => {
            if (res.data.code === '0') {
              this.dispatchBoxesVisible = false
              this.getBoxesList()
            } else {
              this.$message.error('分配盒子失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'index'
</style>
