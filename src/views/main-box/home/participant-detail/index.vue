<template lang="html">
  <div class="participant-detail">
    <div class="header">
      <span class="header-title">{{$t("CHANNEL_STATUS_MEETING_DETAIL")}}</span>
    </div>
    <!-- 参会者详情 -->
    <div class="custom-table-container">
      <div class="table-title">{{ $t('CHANNEL_STATUS_MEETING_NAME') }}：{{ participantName }}</div>
      <!-- 连接时间 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_LINK_DATE')"></div>
        <div class="item-value" v-text="connectTimeOfDate(connectTime)"></div>
      </div>
      <!-- 持续时间 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_ACTIVE_DURATION')"></div>
        <div class="item-value" v-text="participantDuration"></div>
      </div>
      <!-- 系统位置 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_MEETING_LOCATION')"></div>
        <div class="item-value" v-text="systemLocation"></div>
      </div>
      <!-- 信令节点 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_SIGNAL_NODE')"></div>
        <div class="item-value" v-text="signallingNode"></div>
      </div>
      <!-- 媒体节点 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_MEDIA_NODE')"></div>
        <div class="item-value" v-text="mediaNode"></div>
      </div>
      <!-- 角色 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_MEETING_ROLE')"></div>
        <div class="item-value" v-text="$t('CHANNEL_STATUS_MEETING_HOST')" v-if="role=='chair'"></div>
        <div class="item-value" v-text="$t('CHANNEL_STATUS_MEETING_GUEST')" v-if="role=='guest'"></div>
      </div>
      <!-- 是否在演示 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_MEETING_IS_PLAY')"></div>
        <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_Yes')" v-if="presenting"></div>
        <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_No')" v-if="!presenting"></div>
      </div>
      <!-- 是否静音 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_MEETING_IS_MUTED')"></div>
        <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_Yes')" v-if="muted"></div>
        <div class="item-value" v-text="$t('CHANNEL_HOME_Conference_No')" v-if="!muted"></div>
      </div>
      <!-- 协议 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_PROTOCOL')"></div>
        <div class="item-value" v-text="protocol"></div>
      </div>
      <!-- 带宽 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_BANDWIDTH')"></div>
        <div class="item-value" v-text="bandwidth"></div>
      </div>
      <!-- 终端来源 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_DEVICE')"></div>
        <div class="item-value device-origin" v-text="vendor"></div>
      </div>
      <!-- 远程IP -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_IP')"></div>
        <div class="item-value" v-text="remoteAddress"></div>
      </div>
      <!-- 远程端口 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_PORT')"></div>
        <div class="item-value" v-text="remotePort"></div>
      </div>
      <!-- 通话质量 -->
      <div class="item-container">
        <div class="item-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_QUALITY')"></div>
        <div class="item-value" v-text="callQuality"></div>
      </div>
    </div>
    <!-- 媒体流信息 -->
    <div class="custom-table-container">
      <div class="table-title" v-text="$t('CHANNEL_STATUS_PARTICIPANT_MEDIA')"></div>
      <el-table class="custom-table"
                :data="mediaInfoList">
        <!-- 类型 -->
        <el-table-column
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TYPE')">
          <template slot-scope="scope">
            <span v-text="$t('CHANNEL_STATUS_PARTICIPANT_VIDEO')" v-if="scope.row.type=='video'"></span>
            <span v-text="$t('CHANNEL_STATUS_PARTICIPANT_AUDIO')" v-if="scope.row.type=='audio'"></span>
            <span v-text="$t('CHANNEL_STATUS_PARTICIPANT_SHOW')" v-if="scope.row.type=='presentation'"></span>
          </template>
        </el-table-column>
        <!-- 开始时间 -->
        <el-table-column
          prop="startTime" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_START_TIME')">
          <template slot-scope="scope">
            <span v-text="connectTimeOfDate(scope.row.startTime)"></span>
          </template>
        </el-table-column>
        <!-- 节点 -->
        <el-table-column
          prop="node" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_NODE')">
        </el-table-column>
        <!-- 发送解编码器 -->
        <el-table-column
          prop="txCodec" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TX_CODEC')">
        </el-table-column>
        <!-- 发送比特率 -->
        <el-table-column
          prop="txBitrate" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TX_BITRATE')">
        </el-table-column>
        <!-- 发送分辨率 -->
        <el-table-column
          prop="txResolution" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TX_RESOLUTION')">
        </el-table-column>
        <!-- 已发送丢包数 -->
        <el-table-column
          prop="txPacketsSent" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TX_PACKETS_SEND')">
        </el-table-column>
        <!-- 发送丢包数 -->
        <el-table-column
          prop="txPacketsLost" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TX_PACKETS_LOST')">
        </el-table-column>
        <!-- 发送抖动 -->
        <el-table-column
          prop="txJitter" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_TX_JITTER')">
        </el-table-column>
        <!-- 接收解编码器 -->
        <el-table-column
          prop="rxCodec" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_RX_CODEC')">
        </el-table-column>
        <!-- 接收比特率 -->
        <el-table-column
          prop="rxBitrate" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_RX_BITRATE')">
        </el-table-column>
        <!-- 接收分辨率 -->
        <el-table-column
          prop="rxResolution" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_RX_RESOLUTION')">
        </el-table-column>
        <!-- 已接收数据包 -->
        <el-table-column
          prop="rxPacketsReceived" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_RX_PACKETS_RECEIVED')">
        </el-table-column>
        <!-- 接收丢包数 -->
        <el-table-column
          prop="rxPacketsLost" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_RX_PACKETS_LOST')">
        </el-table-column>
        <!-- 接收抖动 -->
        <el-table-column
          prop="rxJitter" width="140" align="center"
          :label="$t('CHANNEL_STATUS_PARTICIPANT_RX_JITTER')">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import api from 'api/index'
  import formatDate from 'utils/format-date'

  export default {
    created () {
      this.getMediaDetail()
    },
    data () {
      let {
        id,
        meetingRoomNum,
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
      } = this.$route.params

      callQuality = this.transferCallQuality(callQuality)

      return {
        id,
        meetingRoomNum,
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
        callQuality,
        mediaInfoList: []
      }
    },
    methods: {
      // 获取媒体流信息列表
      getMediaDetail () {
        let accountId = sessionStorage.getItem('accountId')

        api.home.getMediaInfo({
          accountId,
          id: this.id,
          meetingRoomNum: this.meetingRoomNum
        })
          .then((response) => {
            let responseData = response.data
            if (responseData.code == '0') {
              this.mediaInfoList = responseData.data
            } else {
              this.$message.error(responseData.message)
            }
          })
      },
      connectTimeOfDate (timestamp) {
        return formatDate.timestampToDate(timestamp)
      },
      transferCallQuality (callQuality) {
        let result = ''
        switch (callQuality) {
          case '0_unknown':
            result = this.$t('CHANNEL_STATUS_PARTICIPANT_QUALITY_UNKNOWN')
            break
          case '1_good':
            result = this.$t('CHANNEL_STATUS_PARTICIPANT_QUALITY_GOOD')
            break
          case '2_ok':
            result = this.$t('CHANNEL_STATUS_PARTICIPANT_QUALITY_OK')
            break
          case '3_bad':
            result = this.$t('CHANNEL_STATUS_PARTICIPANT_QUALITY_BAD')
            break
          case '4_Terrible':
            result = this.$t('CHANNEL_STATUS_PARTICIPANT_QUALITY_TERRIBLE')
            break
          default:
            result = this.$t('CHANNEL_STATUS_PARTICIPANT_QUALITY_UNKNOWN')
        }

        return result
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
