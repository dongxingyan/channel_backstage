<template lang="html">
<div class="first-screen">
  <div class="header">
    <span class="header-title">首屏管理</span>
    <div class="search-area">
      <el-autocomplete class="input-area" :fetch-suggestions="querySearchTips" @select="handleSuggestSelect" v-model.trim="searchForm.keyword" placeholder="请输入内容" >
        <el-select popper-class="custom-select" v-model="searchForm.type" slot="prepend">
          <el-option v-for="item in searchForm.options" :key="item.value"
          :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button slot="append">
          <img class="serach-img" @click="searchScreen()" src="../../../../assets/image/enterprise/search.png" alt="">
        </el-button>
      </el-autocomplete>
    </div>
  </div>

  <el-table class="data-table" :data="tableData">
    <el-table-column label="分组" width="200px" prop="name"></el-table-column>
    <el-table-column label="豆腐块">
      <div class="auto-container" slot-scope="{row}" >
        <span class="auto-span" v-for="item of row.screenList">{{item.beanCurdCubeName}}</span>
        <!-- <span class="abs-ellipsis">...</span> -->
      </div>
    </el-table-column>
    <el-table-column label="操作" width="150px">
      <template slot-scope="{row}">
        <span class="opera" @click="editScreenDialogOpen(row.accountId, row.screenList)"><img src="../../../../assets/image/enterprise/edit.png" alt=""> 编辑</span>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination class="pager-pagination" :total="pageParams.totalSize" :current-page.sync="pageParams.pageID" @current-change="getFisrtScreenList" layout="total, slot, prev, pager, next, jumper">
    <span class="page-size-tip">每页{{pageParams.pageSize}}条</span>
  </el-pagination>

  <!-- 编辑豆腐块dialog -->
  <el-dialog title="编辑豆腐块" :visible.sync="editScreenVisible">
    <el-table class="dialog-table" :data="editScreenForm.editScreenList" border>
      <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
      <el-table-column label="名称" align="center" prop="beanCurdCubeName"></el-table-column>
      <el-table-column label="关联APK" align="center" prop="apkName"></el-table-column>
      <el-table-column label="排序" width="80px" align="center">
        <template slot-scope="{row, $index}">
          <el-button :disabled="$index == 0" type="text" size="mini" @click="moveUp(row,$index)"><img src="../../../../assets/image/enterprise/move-up.png"></el-button>
          <el-button :disabled="$index == editScreenForm.editScreenList.length-1" type="text" size="mini" @click="moveDown(row,$index)"><img src="../../../../assets/image/enterprise/move-down.png"></el-button>
          <!-- <span class="opera"><img src="../../../../assets/image/enterprise/move-up.png"></span>
          <span class="opera"><img src="../../../../assets/image/enterprise/move-down.png"></span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70px" align="center">
        <template slot-scope="{row, $index}">
          <img v-if="row.type>1 || !row.id" @click="removeScreen(row, $index)" class="pointer" src="../../../../assets/image/enterprise/delete-red.png" alt="">
        </template>
      </el-table-column>
      <div class="tfoot-add" slot="append"><img class="pointer" @click="importTofuVisible=true" src="../../../../assets/image/enterprise/add.png" alt="" ></div>
    </el-table>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="editScreenDialogSave()">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="editScreenVisible=false">取消</el-button>
    </div>
  </el-dialog>

  <!-- 导入豆腐块dialog -->
  <el-dialog title="导入豆腐块" :visible.sync="importTofuVisible" @close="commonDialogCancel('importTofuVisible', 'importTofuForm')">
    <el-row :gutter="40">
      <el-col class="dialog-left-text" :span="6">选择相关信息：</el-col>
      <el-col :span="12">
        <el-form ref="importTofuForm" :model="importTofuForm" label-width="120px">
          <el-form-item label="豆腐块名称：" prop="tofuId" :rules="{required: true, message: '请选择豆腐块'}">
            <el-select v-model="importTofuForm.tofuId" placeholder="请选择豆腐块" filterable clearable>
              <el-option v-for="item in validTofus" :key="item.tofuId"
              :label="item.beanCurdCubeName" :value="item.tofuId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <div class="btn-area">
      <el-button class="btn-gradient-blue" type="text" @click="importTofuDialogSave('importTofuForm')">保存</el-button>
      <el-button class="btn-gradient-orange" type="text" @click="importTofuVisible = false">取消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import api from 'api/index'

export default {
  name: 'FirstScreen',
  data() {
    let searchOptions = [{
      label: '所属机构',
      value: 1
    }]

    return {
      autoData: [],
      orgs: [],
      validTofus: [],
      searchForm: {
        keyword: '',
        type: 1, // 搜索的类型
        options: searchOptions, // 搜索下拉项
        queryAccountId: ''
      },
      tableData: [],
      pageParams: {
        pageID: 1,
        pageSize: 10,
        totalSize: 0
      },
      importTofuForm: {
        tofuInfo: ''
      },
      editScreenForm: {
        editScreenList: [],
        delIds: []
      },
      editScreenVisible: false,
      importTofuVisible: false
    }
  },
  created() {
    this.getFisrtScreenList()
    this.getOrgs()
    this.getValidTofus()
  },
  mounted() {
    window.onresize = () => {}
    this.$nextTick().then(() => {
      // 点击建议框 清空内容
      document.querySelector('.input-area>div>input').addEventListener('focusin', () => {
        this.searchForm.keyword = ''
      })
    })
  },
  methods: {
    // 通用dialog取消，清除表单验证和数据归零
    commonDialogCancel(visibleName, formName) {
      this.$data[visibleName] = false
      this.$refs[formName].resetFields()
    },
    // 下拉列表模糊查询筛选方法
    querySearchTips(queryString, cb) {
      queryString = this.searchForm.keyword
      let orgs = this.orgs
      let results = queryString ? orgs.filter((item) => {
        if (item.value.includes(queryString)) {
          return true
        }
      }) : orgs
      cb(results)
    },
    searchScreen() {
      let keyword = this.searchForm.keyword
      if (keyword) {
        let validOrg = this.orgs.find((item) => {
          return item.value === keyword
        })
        this.searchForm.queryAccountId = validOrg.id
      } else {
        this.searchForm.queryAccountId = ''
      }
      this.pageParams.pageID === 1 ? this.getFisrtScreenList() : this.pageParams.pageID = 1
    },
    getFisrtScreenList() {
      let reqData = {
        start: this.pageParams.pageID,
        size: this.pageParams.pageSize,
        queryAccountId: this.searchForm.queryAccountId
      }
      api.firstScreen.queryScreenTofus(reqData).then((res) => {
        if (res.data.code === '0') {
          let resData = res.data.data
          this.pageParams.totalSize = resData.totalSize
          this.tableData = resData.resultList
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getValidTofus() {
      api.firstScreen.queryValidTofus().then((res) => {
        if (res.data.code === '0') {
          this.validTofus = res.data.data.map((item) => {
            return {
              tofuId: item.id,
              beanCurdCubeName: item.name,
              apkName: item.apkName,
              type: item.type
            }
          })
        }
      })
    },
    // 获取机构下拉列表
    getOrgs() {
      let reqData = {
        type: 3
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
    // 选择建议列表 item: {id,value}
    handleSuggestSelect(item) {
      this.searchForm.queryAccountId = item.id
      this.pageParams.pageID === 1 ? this.getFisrtScreenList() : this.pageParams.pageID = 1
    },
    // 点击搜索的操作
    searchFirstScreen() {

    },
    editScreenDialogOpen(curAccId, scrrenList) {
      this.editScreenVisible = true
      // 查询对应的豆腐块，因为重名
      // this.getValidTofus(curAccId)
      this.editScreenForm.queryAccountId = curAccId
      this.editScreenForm.editScreenList = [...scrrenList]
    },
    editScreenDialogSave() {
      let classAccId = this.editScreenForm.queryAccountId
      let list = this.editScreenForm.editScreenList.map((item, index) => {
        return {
          id: item.id ? item.id : 0,
          sort: index + 1,
          beanCurdCubeId: item.beanCurdCubeId,
          accountId: classAccId
        }
      })
      let reqData = {
        delIds: this.editScreenForm.delIds,
        beanCurdCubeScreenList: list
      }
      api.firstScreen.editScreenList(reqData).then((res) => {
        if (res.data.code === '0') {
          // 保存成功， 数据主动归零
          this.editScreenVisible = false
          this.getFisrtScreenList()
          this.editScreenForm.delIds = []
        } else {
          this.$message.error('编辑豆腐块失败')
        }
      })
    },
    importTofuDialogSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.importTofuVisible = false
          let tofuInfo = this.validTofus.find((item) => {
            return item.tofuId === this.importTofuForm.tofuId
          })
          tofuInfo.beanCurdCubeId = tofuInfo.tofuId
          this.editScreenForm.editScreenList.push(tofuInfo)
        }
      })
    },
    moveUp(row, index) {
      // 上移一位
      this.editScreenForm.editScreenList.splice(index, 1)
      this.editScreenForm.editScreenList.splice(index - 1, 0, row)
    },
    moveDown(row, index) {
      this.editScreenForm.editScreenList.splice(index, 1)
      this.editScreenForm.editScreenList.splice(index + 1, 0, row)
    },
    removeScreen(row, index) {
      // 判断是新增的 还是 原来传递过来的
      if (row.id) {
        // this.editScreenForm.delIds.push(row.detailList[0].id)
        this.editScreenForm.delIds.push(row.id)
      }
      this.editScreenForm.editScreenList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
@import 'index'
</style>
