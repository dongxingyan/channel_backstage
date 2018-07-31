<template lang="html">
  <div class="create-succeed">
    <div class="header">
      <span class="header-title">{{$t('ADD_CHANNEL_CREATE_CUSTORM')}}</span>
    </div>

    <div class="base-info-title">
      {{$t('ADD_CHANNEL_CREATE_CUSTORM')}}
    </div>

    <div class="info">
      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('CHANNEL_HOME_MANAGEMENT_NEW_CorporateName')}}</span></el-col>
        <el-col :span="20">{{organization.organName}}</el-col>
      </el-row>

      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('ADD_CHANNEL_CUSTORM_ADMIN')}}</span></el-col>
        <el-col :span="3">{{organization.managerName}}</el-col>
        <el-col :span="4"><span class="label-span">{{$t('ADD_CHANNEL_CUSTORM_ADMIN_PASSWORD')}}</span></el-col>
        <el-col :span="3">{{organization.managerPass}}</el-col>
      </el-row>

      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('CHANNEL_HOME_MANAGEMENT_NEW_Linkman')}}</span></el-col>
        <el-col :span="20">{{organization.name}}</el-col>
      </el-row>

      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('ADD_AHANNEL_CUSTORM_ADMIN_PHONENUMBER')}}</span></el-col>
        <el-col :span="20">{{organization.mobile}}</el-col>
      </el-row>

      <el-row class="info-row" :gutter="10">
        <el-col :span="4"> <span class="label-span">{{$t('CHANNEL_HOME_MANAGEMENT_NEW_E-mail')}}</span></el-col>
        <el-col :span="20">{{organization.email}}</el-col>
      </el-row>
    </div>

    <div class="test-meet-title">
      {{$t('ADD_CHANNEL_CUSTORM_TESTCONFRENCE')}}
    </div>

    <div class="info">
      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('CHANNEL_HOME_Conference_EDIT_MeetingRoom')}}</span></el-col>
        <el-col :span="3">{{meetingRoom.meetingRoomNum}}</el-col>
        <el-col :span="4"><span class="label-span">{{$t('ADD_CHANNEL_CUSTORM_MAXBINGFA')}}</span></el-col>
        <el-col :span="3">{{meetingRoom.capacity}}{{$t('ADD_CHANNEL_CUSTOEM_FANG')}}</el-col>
      </el-row>

      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('CHANNEL_HOME_Conference_EDIT_HostPIN')}}</span></el-col>
        <el-col :span="3">{{meetingRoom.hostPassword}}</el-col>
        <el-col :span="4"><span class="label-span">{{$t('CHANNEL_HOME_Conference_EDIT_GuestPIN')}}</span></el-col>
        <el-col :span="3">{{meetingRoom.guestPassword}}</el-col>
      </el-row>

      <el-row class="info-row" :gutter="10">
        <el-col :span="4"><span class="label-span">{{$t('CHANNEL_HOME_Conference_EDIT_ExpirationDate')}}</span></el-col>
        <el-col :span="20">{{meetingRoom.expirationDate}}</el-col>
      </el-row>
    </div>

    <div class="cur-btn-group">
      <el-button class="btn-gradient-blue btn-add" type="text" @click="continueAdd">{{$t('ADD_CHANNEL_CUSTORM_CONTINUE')}}</el-button>
      <el-button class="btn-gradient-orange btn-back" type="text" @click="backCustomerList">{{$t('ADD_CHANNEL_CUSTORM_GOBACK')}}</el-button>
    </div>

  </div>
</template>

<script>
  import utils from 'utils/global-data'

  export default {
    name: 'CreateSucceed',
    created() {
      this.organization = utils.userInfoOfCreate.organization
      this.meetingRoom = utils.userInfoOfCreate.MeetingRoom
    },
    data() {
      return {
        organization: null,
        meetingRoom: null
      }
    },
    methods: {
      // 继续添加按钮操作
      continueAdd() {
        this.$router.push({
          name: 'createCustomer'
        })
      },
      // 返回到客户列表
      backCustomerList() {
        this.$router.push({
          name: 'customer'
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
