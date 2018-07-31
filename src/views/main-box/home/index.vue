<template lang="html">
  <div class="home">

    <div class="header">
      <span class="header-title">{{$t("CHANNEL_HOME_STATUS")}}</span>
    </div>

    <div class="container">
      <div class="home-box">
        <div class="home-box-header">
          {{channelInfo.channelName}}
        </div>
        <div class="home-box-info-container">
          <div class="home-box-info">
            <span class="color-black">{{$t("CHANNEL_HOME_STATUS_TIP")}}：{{channelInfo.username}}</span>
            <br>
            <span class="color-gray">{{$t("CHANNEL_HOME_STATUS_LastLogin")}}：{{channelInfo.lastLoginTime | timestampToDate}}</span>
          </div>
        </div>
      </div>

      <div class="home-box">
        <div class="home-box-header">
          <img src="../../../assets/image/customer-count.png" alt="">
          {{$t("CHANNEL_HOME_STATUS_Customer")}}
        </div>
        <div class="home-box-info-container">
          <div class="home-box-info line-count">
            <span class="color-black">{{$t("CHANNEL_HOME_STATUS_Total_ALL")}}</span>
            <br>
            <span class="all-count">{{channelInfo.organizationCount}}</span>
          </div>
        </div>
      </div>

      <div class="home-box">
        <div class="home-box-header">
          <img  src="../../../assets/image/meet-status.png" alt="">
          {{$t("CHANNEL_HOME_STATUS_MeetingStatistics")}}
        </div>
        <div class="home-box-info-container">
          <div class="home-box-info meet-left line-count" >
            <span class="color-black">{{$t("CHANNEL_HOME_STATUS_Open")}}</span>
            <br>
            <span class="all-count">{{channelInfo.meetingRoomCount}} {{$t('CHANNEL_HOME_Individual')}}</span>
          </div>

          <div class="home-box-info meet-right line-count" >
            <span v-if="channelInfo.meetingCount > 1" class="color-gray">{{$t("CHANNEL_HOME_STATUS_Use")}}: <span class="color-green">{{channelInfo.meetingCount}}{{$t("CHANNEL_HOME_STATUS_Times_MPREONE")}}</span></span>

            <span v-if="channelInfo.meetingCount <= 1" class="color-gray">{{$t("CHANNEL_HOME_STATUS_Use")}}: <span class="color-green">{{channelInfo.meetingCount}}{{$t("CHANNEL_HOME_STATUS_Times")}}</span></span>

            <br>
            <span v-if="(channelInfo.conferenceDuration | secondsToHour) > 1" class="color-gray">{{$t("CHANNEL_HOME_STATUS_Total")}}: <span class="color-green">{{channelInfo.conferenceDuration | secondsToHour}}{{$t("CHANNEL_HOME_STATUS_Hour_MOREONE")}}</span></span>
            <span v-if="(channelInfo.conferenceDuration | secondsToHour) <= 1" class="color-gray">{{$t("CHANNEL_HOME_STATUS_Total")}}: <span class="color-green">{{channelInfo.conferenceDuration | secondsToHour}}{{$t("CHANNEL_HOME_STATUS_Hour")}}</span></span>

          </div>
        </div>
      </div>

      <div class="home-box" v-if="channelInfo.isCustomized">
        <div class="home-box-header">
          <img src="../../../assets/image/customer-count.png" alt="">
          <span>{{$t('CHANNEL_HOME_CLIENT')}}</span>

        </div>
        <div class="home-box-info-container download">
          <div class="ios">
            <div>IOS
              <span class="version" v-if="channelInfo.customized.iosVersion">({{channelInfo.customized.iosVersion}})</span>
            </div>
            <div class="img-div">
              <img src="../../../assets/image/custom/apple-blue.png" alt="">
              <a :href="channelInfo.customized.iosUrl | downloadUrl" v-if="channelInfo.customized.iosVersion">{{$t('CHANNEL_HOME_CLIENT_DOWNLAOD')}}</a>
              <span class="no-config" v-else>{{$t('CHANNEL_HOME_CLIENT_NotConfigured')}}</span>
            </div>
          </div>
          <div class="android">
            <div>Android <span class="version" v-if="channelInfo.customized.androidVersion">({{channelInfo.customized.androidVersion}})</span></div>
            <div class="img-div">
              <img src="../../../assets/image/custom/android-blue.png" alt="">
              <a :href="channelInfo.customized.androidUrl | downloadUrl" v-if="channelInfo.customized.androidVersion">{{$t('CHANNEL_HOME_CLIENT_DOWNLAOD')}}</a>
              <span class="no-config" v-else>{{$t('CHANNEL_HOME_CLIENT_NotConfigured')}}</span>
            </div>
          </div>
          <div class="pc">
            <div style="display: flex;">PC <span class="version" v-if="channelInfo.customized.desktopVersion">({{channelInfo.customized.desktopVersion}})</span></div>
            <div style="display: flex;  flex-wrap: wrap; justify-content: flex-end;">
             <div class="img-div">
              <img src="../../../assets/image/custom/windows-blue.png" alt="">
              <a v-if="channelInfo.customized.windowsUrl" :href="channelInfo.customized.windowsUrl | downloadUrl">{{$t('CHANNEL_HOME_CLIENT_DOWNLAOD')}}</a>
              <span class="no-config" v-else>{{$t('CHANNEL_HOME_CLIENT_NotConfigured')}}</span>
            </div>
            <div class="img-div" style="margin-left: 6px;">
              <img src="../../../assets/image/custom/apple-blue.png" alt="">
              <a v-if="channelInfo.customized.macUrl" :href="channelInfo.customized.macUrl | downloadUrl">{{$t('CHANNEL_HOME_CLIENT_DOWNLAOD')}}</a>
              <span class="no-config" v-else>{{$t('CHANNEL_HOME_CLIENT_NotConfigured')}}</span>
            </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div class="echart-meeting">
      <div id="J-meeting-use"></div>
    </div>
    <!-- 实时会议信息 -->
    <div class="custom-table-container">
      <div class="table-title" v-text="$t('CHANNEL_STATUS_ACTIVE_TITLE')"></div>
      <el-table class="custom-table" v-if="activeMeetingInfoList.length"
                :data="activeMeetingInfoList">

        <el-table-column :label="$t('CHANNEL_STATUS_ACTIVE_NUMBER')">
          <template slot-scope="scope">
            <span @click="getMeetingDetail(scope.row)" v-text="scope.row.meetingRoomNum"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName" align="center"
          :label="$t('CHANNEL_STATUS_ACTIVE_CUSTOMER')">
        </el-table-column>
        <el-table-column
          prop="conferenceDuration" align="center"
          :label="$t('CHANNEL_STATUS_ACTIVE_DURATION')">
        </el-table-column>
        <el-table-column
          prop="participantCount" align="center"
          :label="$t('CHANNEL_STATUS_ACTIVE_PARTICIPANT')">
        </el-table-column>
      </el-table>
      <div class="no-data" v-if="!activeMeetingInfoList.length" v-text="$t('CHANNEL_STATUS_ACTIVE_NO_MEETING')"></div>
    </div>
  </div>
</template>

<script>
  import api from 'api/index'
  import global from 'utils/global-data'
  import formatDate from 'utils/format-date'
  import echarts from 'echarts'
  import {
    apiServer
  } from 'configuration/index'

  export default {
    name: 'Home',
    created () {
      this.getChannelInfo()
      this.getActiveConference()
    },
    data () {
      return {
        channelInfo: {
          customized: {
            androidUrl: '',
            androidVersion: '',
            desktopVersion: '',
            iosUrl: '',
            iosVersion: '',
            macUrl: '',
            windowsUrl: ''
          },
          channelName: '',
          username: '',
          lastLoginTime: '',
          organizationCount: '',
          meetingRoomCount: '',
          meetingCount: '',
          conferenceDuration: '',
          isCustomized: false
        },
        meetingUse: '',
        activeMeetingInfoList: []
      }
    },
    mounted () {
      this.meetingUse = echarts.init(document.getElementById('J-meeting-use'))
      // 获取最近30天会议室、并发 统计数据
      this.getChartDataOfChannel()
      this.getActiveConference()
      window.self = this
    },
    filters: {
      // 10为时间戳转换成标准时间格式
      timestampToDate (value) {
        return formatDate.timestampToDate(value)
      },
      // 秒转换成小时
      secondsToHour (value) {
        return formatDate.secondsToHour(value)
      },
      downloadUrl(value) {
        if (value) {
          return `${apiServer}${value}`
        }
      }
    },
    methods: {
      // 获取渠道信息
      getChannelInfo () {
        let requestData = {
          channelId: sessionStorage.getItem('channelId')
        }
        api.home.getChannelInfo(requestData).then((response) => {
          let responseData = response.data
          if (responseData.code === '0') {
            this.channelInfo = responseData.data
          } else {
            this.$message.error(responseData.message)
          }
        })
      },
      // 获取统计的数据
      getChartDataOfChannel () {
        // 加载图表loading
        this.meetingUse.showLoading()
        // 获取请求参数
        let requestData = {
          startTime: `${formatDate.lastMonthDate()} 00:00:00`,
          endTime: `${formatDate.nowDate()} 00:00:00`
        }
        // 获取会议室使用次数
        this.getMeetingTimesData(requestData, meetingResponse => {
          this.getConcurrentData(requestData, concurrentResponse => {
            // 渲染会议使用图表
            this.renderMeetingUseChart(meetingResponse, concurrentResponse)
          })
        })
      },
      // 获取会议室使用次数 数据
      getMeetingTimesData (requestData, callback) {
        api.statisticsUse.getConferenceData(requestData).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              if (!responseData.data) {
                // 取消加载图表loading
                this.meetingUse.hideLoading()
                return false
              }
              callback(responseData.data.timeline)
            } else {
              // 取消加载图表loading
              this.meetingUse.hideLoading()
              this.$message.error(responseData.message)
            }
          } else {
            // 取消加载图表loading
            this.meetingUse.hideLoading()
          }
        }).catch(error => {
          // 取消加载图表loading
          this.meetingUse.hideLoading()
          this.$message.error(error)
        })
      },
      // 获取最高并发 数据
      getConcurrentData (requestData, callback) {
        api.statisticsUse.getConcurrentData(requestData).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              callback(responseData.data.timeline)
            } else {
              // 取消加载图表loading
              this.meetingUse.hideLoading()
              this.$message.error(responseData.message)
            }
          }
        }).catch(error => {
          // 取消加载图表loading
          this.meetingUse.hideLoading()
          this.$message.error(error)
        })
      },
      /* 渲染会议使用图表 */
      renderMeetingUseChart (meetingData, concurrentData) {
        // 取消加载图表loading
        this.meetingUse.hideLoading()
        let meetingUseOption = {
          color: [
            'rgba(82,192,250,1)', 'rgba(239, 100, 57, 1)'
          ],
          title: {
            text: this.$t('CHANNEL_HOME_STATUS_Last30days'),
            'x': 'left',
            textStyle: {
              color: '#30383d',
              fontWeight: 'bold',
              fontSize: '14'
            },
            left: '10%',
            top: '8%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                opacity: 0.8
              }
            }
          },
          legend: {
            data: [{
              name: this.$t('CHANNEL_HOME_STATUS_userTimes'),
              icon: 'roundRect',
              textStyle: {
                color: '#30383d',
                fontWeight: 'bolder',
                fontSize: '14px'
              }
            }, {
              name: this.$t('CHANNEL_HOME_STATUS_Concurrent'),
              icon: 'roundRect',
              textStyle: {
                color: '#30383d',
                fontWeight: 'bolder',
                fontSize: '14px'
              }
            }],
            align: 'left',
            right: '10%',
            top: '8%'
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            boundaryGap: true,
            data: meetingData.map((item) => { return item.time })
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: [{
            name: this.$t('CHANNEL_HOME_STATUS_userTimes'),
            smooth: true,
            type: 'line',
            lineStyle: {
              normal: {
                width: 5
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            width: '30px',
            data: meetingData.map(item => {
              return item.totalCount
            })
          }, {
            name: this.$t('CHANNEL_HOME_STATUS_Concurrent'),
            smooth: true,
            lineStyle: {
              normal: {
                width: 5
              }
            },
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barMaxWidth: '25px',
            data: concurrentData.map((item) => {
              return item.simultaneous
            })
          }]
        }
        this.meetingUse.setOption(meetingUseOption)
      },
      // 获取实时会议信息列表
      getActiveConference () {
        let accountId = sessionStorage.getItem('accountId')

        api.home.getActiveConferences({ accountId })
          .then((response) => {
            let responseData = response.data
            if (responseData.code == '0') {
              this.activeMeetingInfoList = responseData.data
            } else {
              this.$message.error(responseData.message)
            }
          })
      },
      // 跳转至会议室详情页面
      getMeetingDetail (item) {
        let { meetingRoomNum, conferenceDuration, locked, guestsMuted } = item

        this.$router.push({
          name: 'meeting-detail',
          params: {
            meetingRoomNum,
            conferenceDuration: conferenceDuration || ' ',
            locked,
            guestsMuted
          }
        })
      }
    }
  }
  window.vueEvent.$on('reloadRouter', function() {
    // 获取最近30天会议室、并发 统计数据
    if (window.self.getChartDataOfChannel) {
      window.self.getChartDataOfChannel()
    }
  })
</script>

<style lang="scss">
  @import "index.scss";
</style>
