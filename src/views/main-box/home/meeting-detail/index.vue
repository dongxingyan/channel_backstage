<template lang="html">
   <div class="meeting-detail">
     <div class="header">
       <span class="header-title">{{$t("CHANNEL_STATUS_ACTIVE_TITLE")}}</span>
     </div>
     <!-- 会议总览 -->
     <div class="custom-table-container">
       <div class="table-title" v-text="$t('CHANNEL_STATUS_MEETING_OVERVIEW')"></div>
       <!-- 会议室号 -->
       <div class="item-container">
         <div class="item-title" v-text="$t('CHANNEL_STATUS_ACTIVE_NUMBER')"></div>
         <div class="item-value" v-text="meetingRoomNum"></div>
       </div>
       <!-- 持续时间 -->
       <div class="item-container">
         <div class="item-title" v-text="$t('CHANNEL_STATUS_ACTIVE_DURATION')"></div>
         <div class="item-value" v-text="conferenceDuration"></div>
       </div>
       <!-- 已锁定 -->
       <div class="item-container">
         <div class="item-title" v-text="$t('CHANNEL_STATUS_MEETING_LOCKED')"></div>
         <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_Yes')" v-if="locked"></div>
         <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_No')" v-if="!locked"></div>
       </div>
       <!-- 访客静音 -->
       <div class="item-container">
         <div class="item-title" v-text="$t('CHANNEL_STATUS_MEETING_MUTED')"></div>
         <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_Yes')" v-if="guestsMuted"></div>
         <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_No')" v-if="!guestsMuted"></div>
       </div>
     </div>
     <!-- 参会者详情 -->
     <div class="custom-table-container">
       <div class="table-title" v-text="$t('CHANNEL_STATUS_MEETING_DETAIL')"></div>
       <el-table class="custom-table" v-if="detailInfoList"
                 :data="detailInfoList">
         <!-- 参会者名称 -->
         <el-table-column
           prop="participantName"
           :label="$t('CHANNEL_STATUS_MEETING_NAME')">
         </el-table-column>
         <!-- 持续时间 -->
         <el-table-column
           prop="participantDuration"
           :label="$t('CHANNEL_STATUS_ACTIVE_DURATION')">
         </el-table-column>
         <!-- 系统位置 -->
         <el-table-column
           prop="systemLocation"
           :label="$t('CHANNEL_STATUS_MEETING_LOCATION')">
         </el-table-column>
         <!-- 信令节点 -->
         <el-table-column
           prop="signallingNode"
           :label="$t('CHANNEL_STATUS_PARTICIPANT_SIGNAL_NODE')">
         </el-table-column>
         <!-- 媒体节点 -->
         <el-table-column
           prop="mediaNode"
           :label="$t('CHANNEL_STATUS_PARTICIPANT_MEDIA_NODE')">
         </el-table-column>
         <!-- 角色 -->
         <el-table-column
           :label="$t('CHANNEL_STATUS_MEETING_ROLE')">
           <template slot-scope="scope">
             <span v-text="$t('CHANNEL_STATUS_MEETING_HOST')" v-if="scope.row.role=='chair'"></span>
             <span v-text="$t('CHANNEL_STATUS_MEETING_GUEST')" v-if="scope.row.role=='guest'"></span>
           </template>
         </el-table-column>
         <!-- 是否在演示 -->
         <el-table-column
           :label="$t('CHANNEL_STATUS_MEETING_IS_PLAY')">
           <template slot-scope="scope">
             <span v-text="$t('CHANNEL_HOME_Conference_Yes')" v-if="scope.row.presenting"></span>
             <span v-text="$t('CHANNEL_HOME_Conference_No')" v-if="!scope.row.presenting"></span>
           </template>
         </el-table-column>
         <!-- 是否静音 -->
         <el-table-column
           :label="$t('CHANNEL_STATUS_MEETING_IS_MUTED')">
           <template slot-scope="scope">
             <span v-text="$t('CHANNEL_HOME_Conference_Yes')" v-if="scope.row.muted"></span>
             <span v-text="$t('CHANNEL_HOME_Conference_No')" v-if="!scope.row.muted"></span>
           </template>
         </el-table-column>
         <!-- 总丢包率 -->
         <el-table-column
           prop="totalPacketLoss"
           :label="$t('CHANNEL_STATUS_MEETING_TOTAL_PACKET_LOSS')">
         </el-table-column>
         <!-- 详情 -->
         <el-table-column
           label=""
           width="120">
           <template slot-scope="scope">
             <el-button
               @click.native.prevent="jumpParticipantDetail(scope.row)"
               type="text"
               size="small">
               {{ $t('CHANNEL_STATUS_MEETING_OPERATION') }}
             </el-button>
           </template>
         </el-table-column>
       </el-table>
     </div>
   </div>
</template>

<script>
  import api from 'api/index'
  import global from 'utils/global-data'
  import {
    apiServer
  } from 'configuration/index'

  export default {
    created () {
      this.getParticipantList()
    },
    data () {
      let {
        meetingRoomNum,
        conferenceDuration,
        locked,
        guestsMuted
      } = this.$route.params
      return {
        meetingRoomNum,
        conferenceDuration,
        locked,
        guestsMuted,
        detailInfoList: []
      }
    },
    methods: {
      // 获取参会者信息列表
      getParticipantList () {
        let accountId = sessionStorage.getItem('accountId')

        api.home.getParticipantsInfo({
          accountId,
          meetingRoomNum: this.meetingRoomNum
        })
          .then((response) => {
            let responseData = response.data
            if (responseData.code == '0') {
              this.detailInfoList = responseData.data
            } else {
              this.$message.error(responseData.message)
            }
          })
      },
      // 跳转至会议室详情页面
      jumpParticipantDetail (item) {
        let {
          id,
          participantName,
          connectTime,
          participantDuration,
          systemLocation,
          signallingNode,
          mediaNode,
          role,
          presenting,
          muted,
          protocol,
          bandwidth,
          vendor,
          remoteAddress,
          remotePort,
          callQuality
        } = item

        this.$router.push({
          name: 'participant-detail',
          params: {
            id,
            meetingRoomNum: this.meetingRoomNum,
            participantName,
            connectTime,
            participantDuration,
            systemLocation,
            signallingNode,
            mediaNode,
            role,
            presenting,
            muted,
            protocol,
            bandwidth,
            vendor,
            remoteAddress,
            remotePort,
            callQuality
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
