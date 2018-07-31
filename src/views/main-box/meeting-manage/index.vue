<template lang="html">
  <div class="meeting-manage">
    <div class="header">
      <span class="header-title">{{$t('CHANNEL_HOME_Conference_TIP')}}</span>

      <el-form class="header-form" :model="searchData" inline label-width="70px">
        <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_Keyword')">
          <el-input style="width:190px;" v-model="searchData.keyWord" :placeholder="$t('CHANNEL_HOME_Conference_SEARCH_TIP')"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button class="btn-gradient-blue" type="text" @click="getMeetingList">{{$t('CHANNEL_HOME_MANAGEMENT_Search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table class="data-table" :data="tableData" border>
      <el-table-column :label="$t('CHANNEL_HOME_Conference_MeetingRoom')" prop="meetingRoomNum"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Conference_Owner')" prop="orgName"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Conference_Limit')" prop="capacity"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Conference_HostPIN')" prop="hostPassword"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Conference_GuestPIN')" prop="guestPassword" :formatter="formatGuestPassword"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Conference_ExpirationDate')" prop="expirationDate" :formatter="formatExpiration"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_MANAGEMENT_Operate')">
        <template slot-scope="scope">
          <span class="alter-span" @click="updateMeeting(scope)">{{$t('CHANNEL_HOME_MANAGEMENT_Edit')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pager-pagination" :total="pageParams.totalSize" :current-page.sync="pageParams.pageID" @current-change="getMeetingList" layout="total, slot, prev, pager, next, jumper">
      <span class="page-size-tip">{{$t('CHANNEL_PUBLIC_PREPAGE')}} {{pageParams.pageSize}} {{$t('CHANNEL_PUBLIC_ROW')}}</span>
    </el-pagination>

    <!-- 修改会议室 dialog -->
    <el-dialog :title="$t('CHANNEL_HOME_Conference_EDIT')" :visible.sync="dialogVisible" top="10%">
      <el-row>
        <el-col :span="16">
          <el-form :model="updateMeetingForm" ref="updateForm" :rules="rules" label-width="200px">
            <el-form-item :label="$t('CHANNEL_HOME_Conference_EDIT_MeetingRoom')">
              <span v-text="updateMeetingForm.meetingRoomNum"></span>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_Conference_EDIT_Owner')">
              <span v-text="updateMeetingForm.orgName"></span>
            </el-form-item>
            <el-form-item v-if="isCustomized" :label="$t('CHANNEL_CONFERENCE_THEME')" prop="themeId">
              <el-select filterable v-model="updateMeetingForm.themeId" :placeholder="$t('CHANNEL_CONFERENCE_SELECT_THEME')">
                <el-option v-for="theme in themes" :key="theme.themeId" :label="theme.themeName" :value="theme.themeId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="errorTip"  :label="$t('CHANNEL_HOME_Conference_EDIT_Limit')" prop="capacity">
              <el-input v-model="updateMeetingForm.capacity" :placeholder="$t('CHANNEL_HOME_Conference_Limit')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_Conference_EDIT_ExpirationDate')">
              <span v-text="updateMeetingForm.expirationDate"></span>
            </el-form-item>
            <el-form-item class="errorTip" :label="$t('CHANNEL_HOME_Conference_EDIT_HostPIN')" prop="hostPassword">
              <el-input v-model="updateMeetingForm.hostPassword" :placeholder="$t('CHANNEL_HOME_Conference_HostPIN')"></el-input>
              <span class="pass-tip">{{$t('CHANNEL_HOME_Conference_PASSWORDTIP')}}</span>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_Conference_AllowGuests')">
              <el-radio-group v-model="updateMeetingForm.allowGuestFlag">
                <el-radio :label="1">{{$t('CHANNEL_HOME_Conference_Yes')}}</el-radio>
                <el-radio :label="0">{{$t('CHANNEL_HOME_Conference_No')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="errorTip" :label="$t('CHANNEL_HOME_Conference_EDIT_GuestPIN')" prop="guestPassword" v-show="updateMeetingForm.allowGuestFlag">
              <el-input v-model="updateMeetingForm.guestPassword" :placeholder="$t('CHANNEL_HOME_Conference_GuestPIN')"></el-input>
              <span class="pass-tip">{{$t('CHANNEL_HOME_Conference_PASSWORDTIP')}}</span>
            </el-form-item>
            <el-form-item>
              <div style="margin-left: -20px;">
                <el-button class="btn-gradient-blue" type="text" @click="dialogSave">{{$t('CHANNEL_HOME_MANAGEMENT_SAVE')}}</el-button>
                <el-button class="btn-gradient-orange" type="text" @click="dialogCancel">{{$t('CHANNEL_HOME_MANAGEMENT_CANCEL')}}</el-button>
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
//  import { MEETING_UPDATE_SUCCESS } from 'configuration/global-const'
  import { mapState } from 'vuex'

  export default {
    name: 'MeetingManage',
    watch: {
      'updateMeetingForm.allowGuestFlag': function(nval, oval) {
        if (oval !== '') {
          let preHostPass = this.updateMeetingForm.hostPassword
          this.$refs['updateForm'].resetFields()
          this.updateMeetingForm.hostPassword = preHostPass
        }
      }
    },
    data () {
      // custom validator
      let pattern = /^\d{6}$/
      let rules = {
        capacity: {
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error(this.$t('CHANNEL_CONFERENCE_LIMITNUM')))
            } else if (!/^[1-9]\d{0,5}$|^1000000$/.test(value)) {
              callback(new Error(this.$t('CHANNEL_CONFERENCE_LIMIT_ERROR')))
            } else {
              callback()
            }
          }
        },
        hostPassword: {
          validator: (rule, value, callback) => {
            // 分为是否两种方案,是的时候：主持人密码不能为空；否：主持人密码可以为空
            if (this.updateMeetingForm.allowGuestFlag == 0 && value === '') {
              // 否选中，主持人密码为空放过
              return callback()
            }
            if (pattern.test(value)) {
              callback()
            } else {
              callback(new Error(this.$t('CHANNEL_CONFERENCE_PASSWORD_ERROR')))
            }
          }
        },
        guestPassword: {
          validator: (rule, value, callback) => {
            if (value === '') {
              // 访客密码为空放过
              return callback()
            }
            if (pattern.test(value)) {
              if (value === this.updateMeetingForm.hostPassword) {
                // 访客密码等于主持人密码
                callback(new Error(this.$t('CHANNEL_CONFERENCE_GUEST_PASSWORD_ERROR')))
              } else {
                callback()
              }
            } else {
              callback(new Error(this.$t('CHANNEL_CONFERENCE_PASSWORD_ERROR')))
            }
          }
        }
      }

      return {
        searchData: {
          keyWord: ''
        }, // 搜索表单model
        pageParams: {
          pageID: 1,
          pageSize: 10,
          totalSize: 0
        },
        tableData: null, // 填充表格的数据
        dialogVisible: false, // dialog 的显示
        updateMeetingForm: {
          id: '',
          meetingRoomNum: '',
          orgName: '',
          capacity: '',
          expirationDate: '',
          hostPassword: '',
          allowGuestFlag: '',
          guestPassword: '',
          themeCustomizedId: '',
          themeId: '',
          themeName: '',
          themeUuid: ''
        }, // 修改会议室传递进来的数据
        rules: rules,
        themes: []
      }
    },
    computed: {
      ...mapState(['isCustomized'])
    },
    created () {
      // 初始化会议室管理列表
      this.getMeetingList()
    },
    methods: {
      // getThemes({selectAccountId}) {
      //   api.meetingRoom.reqGetThemes({selectAccountId}).then((res) => {
      //     if (res.data.code === '0') {
      //       this.themes = res.data.data
      //       this.themes.splice(0, 0, {themeName: '默认主题', themeId: null})
      //     }
      //   })
      // },
      // 加载会议室管理列表
      getMeetingList() {
        let requestParams = {
          channelId: sessionStorage.getItem('channelId'),
          keyword: this.searchData.keyWord ? this.searchData.keyWord : null,
          start: this.pageParams.pageID,
          size: this.pageParams.pageSize
        }
        api.meetingRoom.getMeetingList(requestParams).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              this.tableData = responseData.data.resultList
              this.pageParams.totalSize = responseData.data.totalSize
            } else {
              this.$message.error(responseData.message)
            }
          }
        })
      },
      // 打开修改模态框
      updateMeeting({ row }) {
        this.updateMeetingForm.id = row.id
        this.updateMeetingForm.meetingRoomNum = row.meetingRoomNum
        this.updateMeetingForm.orgName = row.orgName
        this.updateMeetingForm.capacity = row.capacity
        this.updateMeetingForm.expirationDate = row.expirationDate
        this.updateMeetingForm.hostPassword = row.hostPassword
        this.updateMeetingForm.allowGuestFlag = row.allowGuestFlag
        this.updateMeetingForm.guestPassword = row.guestPassword
        this.updateMeetingForm.themeId = row.themeId
        // this.getThemes({selectAccountId: row.accountId})
        api.meetingRoom.reqGetThemes({selectAccountId: row.accountId}).then((res) => {
          if (res.data.code === '0') {
            this.themes = res.data.data
            let isMatch = res.data.data.find((item) => item.themeId === this.updateMeetingForm.themeId)
            if (!isMatch) {
              this.updateMeetingForm.themeId = null
            }
          }
        })
        this.dialogVisible = true
      },
      // dialog 保存按钮操作
      dialogSave() {
        // 保存前增加表单验证
        this.$refs['updateForm'].validate((valid) => {
          // 验证主持人和访客密码
          if (!valid) {
            return
          }
          this.dialogVisible = false
          // 如果不允许参会者加入，设置对应的参会者密码为空
          if (!this.updateMeetingForm.allowGuestFlag) {
            this.updateMeetingForm.guestPassword = ''
          }
          /*
          themeCustomizedId: '',
          themeId: '',
          themeName: '',
          themeUuid: ''
           */
          let theme = this.themes.find((item) => item.themeId === this.updateMeetingForm.themeId)
          let reqData
          if (theme && theme.themeId) {
            reqData = Object.assign(this.updateMeetingForm, {themeCustomizedId: theme.id, themeName: theme.themeName, themeUuid: theme.themeUuid})
          } else {
            reqData = Object.assign(this.updateMeetingForm, {themeName: ''})
          }
          api.meetingRoom.updateMeetingInfoByID(reqData)
            .then(response => {
              if (response.data.code === '0') {
                // 给出修改成功提示
                this.$message({
//                  message: MEETING_UPDATE_SUCCESS,
                  message: this.$t('MEETING_UPDATE_SUCCESS'),
                  type: 'success'
                })
                // 重新渲染修改后的数据
                this.getMeetingList()
              } else {
                this.$message.error(response.data.message)
              }
            }).catch((err) => {
              this.$message.error(err.toString())
            })
        })
      },
      // dialog 取消按钮操作
      dialogCancel() {
        this.dialogVisible = false
        this.$refs['updateForm'].resetFields()
      },
      // 格式化表格数据 有效期
      formatExpiration(row, column, cellValue) {
        return cellValue.slice(0, 10)
      },
      // 访客密码显示问题
      formatGuestPassword(row, column, cellValue) {
        if (row.allowGuestFlag) {
          return cellValue
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
