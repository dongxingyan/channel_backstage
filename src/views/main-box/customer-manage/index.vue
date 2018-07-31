<template lang="html">
  <div class="customer-manage">
    <div class="header">
      <span class="header-title">{{$t('CHANNEL_CUSTOMER_MANAGEMENT')}}</span>
      <el-button class="create-btn btn-gradient-blue" type="text"  @click="createCustomer">{{$t('CHANNEL_HOME_MANAGEMENT_New')}}</el-button>

      <el-form class="header-form" :model="searchData" inline label-width="70px">
        <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_Keyword')">
          <el-input v-model="searchData.keyWord" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_CorporateName')"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button class="btn-gradient-blue" type="text" @click="getCustomerList">{{$t('CHANNEL_HOME_MANAGEMENT_Search')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('CHANNEL_STATUS_PARTICIPANT_TYPE')">
          <el-select v-model="type" clearable @change="typeChange" :placeholder="$t('CHANNEL_COMMON_SELECT')">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('CHANNEL_COMMON_STATUS')">
          <el-select v-model="status" clearable @change="statusChange" :placeholder="$t('CHANNEL_COMMON_SELECT')">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <el-table class="data-table" :data="tableData" border>
      <el-table-column :label="$t('CHANNEL_HOME_MANAGEMENT_CorporateName')" prop="name"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_MANAGEMENT_CreateTime')" prop="createTime" :formatter="formatDate"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_MANAGEMENT_ManageAccount')" prop="orgManagerName"></el-table-column>
      <el-table-column :label="$t('CHANNEL_STATUS_PARTICIPANT_TYPE')" prop="type" :formatter="formatType"></el-table-column>
      <el-table-column :label="$t('CHANNEL_COMMON_STATUS')" prop="status" :formatter="formatStatus"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_MANAGEMENT_Operate')">
        <template slot-scope="scope">
          <span class="alter-span" @click="openUpdateModal(scope)">{{$t('CHANNEL_HOME_MANAGEMENT_Edit')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pager-pagination" :total="pageParams.totalSize" :current-page.sync="pageParams.pageID" @current-change="getCustomerList" layout="total, slot, prev, pager, next, jumper">
      <span class="page-size-tip">{{$t('CHANNEL_PUBLIC_PREPAGE')}} {{pageParams.pageSize}} {{$t('CHANNEL_PUBLIC_ROW')}}</span>
    </el-pagination>

    <!-- 修改客户页面 dialog -->
    <el-dialog :title="$t('CHANNEL_HOME_MANAGEMENT_EDIT_Tip')" :visible.sync="dialogVisible" top="8%">
      <el-row>
        <el-col :span="16">
          <el-form :model="customerForm"  ref="form" :rules="rules" label-width="200px">
            <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_EDIT_CorporateName')" prop="name">
              <el-input v-model="customerForm.name" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_EDIT_CorporateNameTip')"></el-input>
            </el-form-item>
            <el-form-item  :label="$t('CHANNEL_HOME_MANAGEMENT_EDIT_ManageAccount')">
              <template>{{managerName}}</template>
            </el-form-item>
            <el-form-item  :label="$t('CHANNEL_HOME_MANAGEMENT_EDIT_Password')">
              <el-input v-model="customerForm.managerPass" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_EDIT_PasswordTip')"></el-input>
              <span class="no-pass-tip">{{$t('CHANNEL_HOME_MANAGEMENT_EDIT_NoPasswordTip')}}</span>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_Linkman')">
              <el-input v-model="customerForm.contact" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_LinkmanTip')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_Contact')">
              <el-input v-model="customerForm.mobile" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_ContactTip')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_E-mail')">
              <el-input v-model="customerForm.email" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_E-mailTip')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_NEW_Remarks')">
              <el-input type="textarea" v-model="customerForm.remark" :placeholder="$t('CHANNEL_HOME_MANAGEMENT_NEW_RemarksTip')"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="margin-left: -20px;">
                <el-button class="btn-gradient-blue" type="text" @click="updateCustomer('form')">{{$t('CHANNEL_HOME_MANAGEMENT_SAVE')}}</el-button>
                <el-button class="btn-gradient-orange" type="text" @click="dialogCancle">{{$t('CHANNEL_HOME_MANAGEMENT_CANCEL')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import api from 'api/index'
  import global from 'utils/global-data'
//  import { CUSTOMER_UPDATE_SUCCESS } from 'configuration/global-const'
  export default {
    name: 'CustomerManage',
    created () {
      // 初始化客户管理列表
      this.getCustomerList()
    },
    data() {
      let validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('CHANNEL_CUSTOMER_NAME_ERROR')))
        } else {
          callback()
        }
      }
      let rules = {
        name: [
          {required: true, validator: validateName, trigger: 'blur'}
        ]
      }
      return {
        searchData: {
          keyWord: ''
        },
        pageParams: {
          pageID: 1,
          pageSize: 10,
          totalSize: 0
        },
        tableData: null,
        dialogVisible: false,
        managerName: '',
        customerForm: {
          name: '',
          managerPass: '',
          contact: '',
          mobile: '',
          email: '',
          remark: ''
        },
        rules: rules,
        status: '',
        statusList: [{
          id: 0,
          label: this.$t('ADD_CHANNEL_CUSTORM_CLOSE')
        }, {
          id: 1,
          label: this.$t('ADD_CHANNEL_CUSTORM_NORMAL')
        }],
        type: '',
        typeList: [{
          id: 1,
          label: this.$t('ADD_CHANNEL_CUSTORM_FORMAL')
        }, {
          id: 2,
          label: this.$t('ADD_CHANNEL_CUSTORM_TEST')
        }]
      }
    },
    methods: {
      // 跳转到创建客户页面
      createCustomer() {
        this.$router.push({name: 'createCustomer'})
      },
      // 加载客户管理列表
      getCustomerList() {
        let requestParams = {
          channelId: sessionStorage.getItem('channelId'),
          keyword: this.searchData.keyWord ? this.searchData.keyWord : null,
          start: this.pageParams.pageID,
          size: this.pageParams.pageSize
        }
        let type = this.type
        let status = this.status

        if (type === 1 || type === 2) {
          requestParams.type = type
        }
        if (status === 0 || status === 1) {
          requestParams.status = status
        }
        api.customer.getCustomerList(requestParams).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              this.tableData = responseData.data.resultList
              this.pageParams.totalSize = responseData.data.totalSize
            } else {
              this.$message.error(responseData.message)
            }
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      // 打开修改模态框
      openUpdateModal({row}) {
        this.customerForm.managerPass = ''
        // 显示修改模态框
        this.dialogVisible = true
        // 根据客户ID获取客户详情
        let requestData = {
          channelId: sessionStorage.getItem('channelId'),
          id: row.id
        }
        api.customer.getCustomerInfoByID(requestData)
          .then(response => {
            if (response.data.code === '0') {
              let responseData = response.data.data
              // 不显示密码
              responseData.managerPass = ''
              // 渲染数据到模态框
              this.managerName = responseData.managerName
              this.customerForm.name = responseData.organName
              this.customerForm.contact = responseData.name
              this.customerForm.mobile = responseData.mobile
              this.customerForm.email = responseData.email
              this.customerForm.remark = responseData.remark
              this.customerForm.id = requestData.id
            } else {
              this.$message.error(response.data.message)
            }
          })
          .catch(error => {
            this.$message.error(error.toString())
          })
        this.$refs['form'].clearValidate()
      },
      // 修改客户信息
      updateCustomer(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.customerForm.name) {
              this.customerForm.name = this.customerForm.name.replace(/(^\s*)|(\s*$)/g, '')
              if (this.customerForm.name.length == 0) {
                this.$message.warning(this.$t('CUSTORM_NAME_ERROR'))
                return
              }
            }
            api.customer.updateCustomerInfoByID(this.customerForm)
              .then(response => {
                if (response.data.code === '0') {
                  // 关闭修改模态框
                  this.dialogVisible = false
                  // 给出修改成功提示
                  this.$message({
//                message: CUSTOMER_UPDATE_SUCCESS,
                    message: this.$t('CUSTOMER_UPDATE_SUCCESS'),
                    type: 'success'
                  })
                  // 重新渲染修改后的数据
                  this.getCustomerList()
                } else {
                  this.$message.error(response.data.message)
                }
              })
              .catch(error => {
                this.$message.error(error.toString())
              })
          }
        })
      },
      // 关闭修改模态框
      dialogCancle() {
        this.$refs['form'].clearValidate()
        this.dialogVisible = false
      },
      // 格式化表格时间
      formatDate(row, column, cellValue) {
        return cellValue.slice(0, -2)
      },
      // 格式化类型条目
      formatType(row, column, cellValue) {
        let result
        switch (cellValue) {
          case 1:
            result = this.$t('ADD_CHANNEL_CUSTORM_FORMAL')
            break
          case 2:
            result = this.$t('ADD_CHANNEL_CUSTORM_TEST')
            break
        }
        return result
      },
      // 格式化状态条目
      formatStatus(row, column, cellValue) {
        return cellValue ? this.$t('ADD_CHANNEL_CUSTORM_NORMAL') : this.$t('ADD_CHANNEL_CUSTORM_CLOSE')
      },
      // 类型条目更改
      typeChange() {
        this.getCustomerList()
      },
      // 状态条目更改
      statusChange() {
        this.getCustomerList()
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
