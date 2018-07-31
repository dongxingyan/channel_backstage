<template lang="html">
  <div class="statistics-use">
    <div class="header">
      <span class="header-title">{{$t('CHANNEL_USE_STATISTICS')}}</span>
      <el-row class="header-statistics use" :gutter="10">
        <el-col :span="6" style="padding:0;">
          <el-button-group>
            <el-button type="infor" @click="getOneWeekData" :style="curSelectBtn === 'oneWeek' ?btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_7Days')}}</el-button>
            <el-button type="infor" @click="getOneMonthData" :style="curSelectBtn === 'oneMonth' ?btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_30Days')}}</el-button>
            <el-button type="infor" @click="getOneYearData" :style="curSelectBtn === 'oneYear' ?btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_1year')}}</el-button>
          </el-button-group>
        </el-col>

        <el-col :span="10">
          <el-date-picker :picker-options="pickerOptions" v-model="startTime" :placeholder="$t('CHANNEL_HOME_Terminal_Statistics_selectDate')" type="date" format="yyyy-MM-dd"></el-date-picker>
          <span>{{$t('CHANNEL_HOME_Terminal_Statistics_to')}}</span>
          <el-date-picker :picker-options="pickerOptions" v-model="endTime" :placeholder="$t('CHANNEL_HOME_Terminal_Statistics_selectDate')" type="date" format="yyyy-MM-dd"></el-date-picker>
        </el-col>

        <el-col :span="6">
          <el-input  class="statistics-search" v-model="keyword" :placeholder="$t('CHANNEL_HOME_Terminal_Statistics_SEARCHTIP')"></el-input>
          <el-button type="text" @click="searchDataByCondition">{{$t('CHANNEL_HOME_MANAGEMENT_Search')}}</el-button>
        </el-col>

        <el-col :span="2">
          <el-button class="use-export" type="text" @click="outputTable">{{$t('CHANNEL_HOME_Terminal_Statistics_Export')}}</el-button>
        </el-col>
      </el-row>
    </div>

    <div v-show="!conference.isEmptyOfUseTime" class="no-data-container">
      <span>{{$t('CHANNEL_HOME_Terminal_Statistics_ConferenceUserNum')}}</span>
      <NoData/>
    </div>
    <el-row v-show="conference.isEmptyOfUseTime" class="echart-box">
      <el-col class="echart-box-content" id="meeting-use-times" :span="17" ></el-col>
      <el-col class="echart-box-table" :span="6" :offset="1">
          <!-- echart-box-table -->
          <el-row class="echart-box-table-th" :gutter="10" >
            <el-col :span="12" >{{$t('CHANNEL_HOME_Terminal_Statistics_Customer')}}</el-col>
            <el-col :span="8" :offset="4">{{$t('CHANNEL_HOME_Terminal_Statistics_Times')}}</el-col>
          </el-row>

          <div class="echart-box-table-tbody">
            <el-row :key="index" v-for="(conference, index) of conference.meetingTimesData" :gutter="10">
              <el-col class="echart-box-table-tbody-name" :span="12" :title="conference.orgName">{{conference.orgName}}</el-col>
              <el-col class="echart-box-table-tbody-count" :span="8" :offset="4" >{{conference.orgCount}}</el-col>
            </el-row>
          </div>
      </el-col>
    </el-row>

    <div v-show="!concurrent.isEmptyOfConcurrent" class="no-data-container">
      <span>{{$t('CHANNEL_HOME_Terminal_Statistics_Maximum')}}</span>
      <NoData/>
    </div>
    <el-row v-show="concurrent.isEmptyOfConcurrent" class="echart-box">
      <el-col class="echart-box-content" id="meeting-concurrent" :span="17" ></el-col>
      <el-col class="echart-box-table" :span="6" :offset="1">
        <!-- echart-box-table -->
        <el-row class="echart-box-table-th" :gutter="10">
          <el-col :span="12" >{{$t('CHANNEL_HOME_Terminal_Statistics_Customer')}}</el-col>
          <el-col :span="8" :offset="4">{{$t('CHANNEL_HOME_Terminal_Statistics_Concurrent')}}</el-col>
        </el-row>
        <div class="echart-box-table-tbody">
          <el-row :key="index" v-for="(concurrent, index) of concurrent.concurrentData" :gutter="10">
            <el-col class="echart-box-table-tbody-name" :span="12" :title="concurrent.orgName" v-text="concurrent.orgName"></el-col>
            <el-col :span="8" :offset="4" v-text="concurrent.simultaneous"></el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <div v-show="!conferenceTimes.isEmptyOfMeetingTimes" class="no-data-container">
      <span>{{$t('CHANNEL_HOME_Terminal_Statistics_meetingTime')}}</span>
      <NoData/>
    </div>
    <el-row v-show="conferenceTimes.isEmptyOfMeetingTimes" class="meeting-times">
      <el-col class="meeting-times-echart" id="meeting-times"></el-col>
      <el-col>
        <div class="flex-container">
          <div class="inner">
            <div class="item1" style="width:200px;">
              {{$t('CHANNEL_HOME_Terminal_Statistics_Date')}}
            </div>
            <div class="item2">
              {{$t('CHANNEL_HOME_Terminal_Statistics_Conference_Room_Times')}}
            </div>
            <div class="item3">
              {{$t('CHANNEL_HOME_Terminal_Statistics_Attend_Meeting_Total_Times')}}
            </div>
          </div>

          <div class="inner" v-for="(conference, index) in conferenceTimes.conferenceData">
            <div class="item1" v-text="conference.time"></div>
            <div class="item2">{{conference.duration | transformToHour}}</div>
            <div class="item3">{{conferenceTimes.participantData[index].duration | transformToHour}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from 'api/index'
  import NoData from 'components/NoData.vue'
  import globalData from 'utils/global-data'
  import formatDate from 'utils/format-date'
  import echarts from 'echarts'
  import { apiServer } from 'configuration/index'
//  import { NEED_SELECT_START_TIME, NEED_SELECT_END_TIME, NEED_LEGAL_START_TIME } from 'configuration/global-const'

  export default {
    name: 'StatisticsUse',
    created () {
    },
    components: {
      NoData
    },
    data () {
      return {
        startTime: '',
        endTime: '',
        pickerOptions: globalData.pickerOptions,
        keyword: '',
        conference: {
          isEmptyOfUseTime: true,
          meetingTimesData: null,
          meetingUseTimes: ''
        },
        concurrent: {
          isEmptyOfConcurrent: true,
          concurrentData: null,
          meetingConcurrent: ''
        },
        conferenceTimes: {
          isEmptyOfMeetingTimes: true,
          meetingTimes: '',
          conferenceData: '',
          participantData: ''
        },
        btnBackStyle: {
          background: `#31a3dd`,
          color: `white`
        },
        curSelectBtn: 'oneWeek'
      }
    },
    filters: {
      // 秒转换成小时
      transformToHour (value) {
        return formatDate.secondsToHour(value)
      }
    },
    mounted () {
      this.conference.meetingUseTimes = echarts.init(document.getElementById('meeting-use-times'))
      this.concurrent.meetingConcurrent = echarts.init(document.getElementById('meeting-concurrent'))
      this.conferenceTimes.meetingTimes = echarts.init(document.getElementById('meeting-times'))
      // 获取近一周数据
      this.getOneWeekData()
      this.meetingTimesChartClick()
      window.self = this
    },
    methods: {
      /* 获取统计的数据 */
      getCountData (startTime, endTime, orgStr) {
        // 设置开始时间、结束时间
        this.startTime = `${formatDate.formatOfDateStyle(startTime)}`
        this.endTime = `${formatDate.formatOfDateStyle(endTime)}`
        // 格式化 开始、结束时间
        startTime = `${formatDate.formatOfDateStyle(startTime)} 00:00:00`
        endTime = `${formatDate.formatOfDateStyle(endTime)} 00:00:00`
        // 加载图表loading
        this.conference.meetingUseTimes.showLoading()
        this.concurrent.meetingConcurrent.showLoading()
        this.conferenceTimes.meetingTimes.showLoading()
        // 获取请求参数
        let requestData = {
          startTime: startTime,
          endTime: endTime
        }
        if (orgStr) requestData.orgList = orgStr.replace(/，/g, ',')
        setTimeout(() => {
          // 获取会议室使用次数 相关统计数据
          api.statisticsUse.getConferenceData(requestData).then(response => {
            if (response.status !== 200) {
              this.conference.meetingUseTimes.hideLoading()
              this.$message.error(response.statusText)
              return false
            }
            if (response.data) {
              let responseData = response.data
              if (responseData.code === '0') {
                let resData = responseData.data
                if (resData && (resData.timeline.length || resData.orgDetail.length)) {
                  this.conference.isEmptyOfUseTime = true
                  this.renderMeetingTimesChart(resData.timeline)
                  this.conference.meetingTimesData = resData.orgDetail
                } else {
                  this.conference.isEmptyOfUseTime = false
                }
              } else {
                this.$message.error(responseData.message)
                this.conference.isEmptyOfUseTime = false
              }
            }
          })
        }, 500)

        setTimeout(() => {
          // 获取并发 相关统计数据
          api.statisticsUse.getConcurrentData(requestData).then(response => {
            if (response.status !== 200) {
              this.concurrent.meetingConcurrent.hideLoading()
              this.$message.error(response.statusText)
              return false
            }
            if (response.data) {
              let responseData = response.data
              if (responseData.code === '0') {
                let resData = responseData.data
                if (resData && (resData.timeline.length || resData.orgDetail.length)) {
                  this.concurrent.isEmptyOfConcurrent = true
                  this.renderConcurrentChart(resData.timeline)
                  this.concurrent.concurrentData = resData.orgDetail
                } else {
                  this.concurrent.isEmptyOfConcurrent = false
                }
              } else {
                this.$message.error(responseData.message)
                this.concurrent.isEmptyOfConcurrent = false
              }
            }
          })
        }, 1000)

        setTimeout(() => {
          // 获取会议时长 相关统计数据
          api.statisticsUse.getDurationData(requestData).then(response => {
            if (response.status !== 200) {
              this.conferenceTimes.meetingTimes.hideLoading()
              this.$message.error(response.statusText)
              return false
            }
            if (response.data) {
              let responseData = response.data
              if (responseData.code === '0') {
                let resData = responseData.data
                if (resData && (resData.conference.length || resData.participant.length)) {
                  this.conferenceTimes.isEmptyOfMeetingTimes = true
                  this.renderMeetingDurationChart(resData)
                  this.renderMeetingDurationTable(resData)
                } else {
                  this.conferenceTimes.isEmptyOfMeetingTimes = false
                }
              } else {
                this.$message.error(responseData.message)
                this.conferenceTimes.isEmptyOfMeetingTimes = false
              }
            }
          })
        }, 2000)
      },
      /* 渲染会议次数图表 */
      renderMeetingTimesChart (data) {
        // 取消图表loading的加载
        this.conference.meetingUseTimes.hideLoading()
        let option = {
          color: [
            '#169bd5'
          ],
          toolbox: {
            show: true,
            right: '30px',
            feature: {
              magicType: {show: true, type: ['line', 'bar']}
            }
          },
          title: {
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_ConferenceUserNum'),
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                opacity: 0.8
              }
            }
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            boundaryGap: true,
            data: data.map((item) => {
              return item.time
            })
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: this.$t('CHANNEL_HOME_Terminal_Statistics_Times'),
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barMaxWidth: '25px',
            data: data.map((item) => {
              return item.totalCount
            })
          }]
        }
        this.conference.meetingUseTimes.setOption(option)
      },
      /* 渲染最高并发图表 */
      renderConcurrentChart (data) {
        // 取消图表loading的加载
        this.concurrent.meetingConcurrent.hideLoading()
        let concurrentOption = {
          color: [
            '#169bd5'
          ],
          toolbox: {
            show: true,
            right: '30px',
            feature: {
              magicType: {show: true, type: ['line', 'bar']}
            }
          },
          title: {
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_Maximum'),
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                opacity: 0.8
              }
            }
          },
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            boundaryGap: true,
            data: data.map((item) => {
              return item.time
            })
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            size: ['60%', '60%'],
            name: this.$t('CHANNEL_HOME_Terminal_Statistics_Concurrent_NUM'),
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barMaxWidth: '25px',
            data: data.map((item) => {
              return item.simultaneous
            })
          }]
        }
        this.concurrent.meetingConcurrent.setOption(concurrentOption)
      },
      /* 渲染会议时长图表 */
      renderMeetingDurationChart (data) {
        // 取消图表loading的加载
        this.conferenceTimes.meetingTimes.hideLoading()
        let meetingTimesOption = {
          color: [
            '#169bd5', '#F7A35C'
          ],
          title: {
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_meetingTime'),
            'x': 'center'
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
            data: [this.$t('CHANNEL_HOME_Terminal_Statistics_Conference_Room_Times'), this.$t('CHANNEL_HOME_Terminal_Statistics_Attend_Meeting_Total_Times')],
            top: 'bottom'
          },
          toolbox: {
            show: true,
            right: '30px',
            feature: {
              magicType: {show: true, type: ['line', 'bar']}
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            boundaryGap: true,
            data: data.conference.map((item) => {
              return item.time
            })
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: [
            {
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Attend_Meeting_Total_Times'),
              type: 'line',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              barMaxWidth: '25px',
              data: data.participant.map((item) => {
                return (Math.ceil(item.duration / 60) / 60).toFixed(1)
              })
            },
            {
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Conference_Room_Times'),
              type: 'line',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              'barMaxWidth': '25px',
              data: data.conference.map((item) => {
                return (Math.ceil(item.duration / 60) / 60).toFixed(1)
              })
            }
          ]
        }
        this.conferenceTimes.meetingTimes.setOption(meetingTimesOption)
      },
      /* 渲染会议时长 表格 */
      renderMeetingDurationTable (data) {
        this.conferenceTimes.conferenceData = data.conference
        this.conferenceTimes.participantData = data.participant
      },
      /* 获取近一周的统计数据 */
      getOneWeekData () {
        this.curSelectBtn = 'oneWeek'
        this.getCountData(formatDate.lastWeekDate(), formatDate.nowDate(), this.keyword)
      },
      /* 获取近一月的统计数据 */
      getOneMonthData () {
        this.curSelectBtn = 'oneMonth'
        this.getCountData(formatDate.lastMonthDate(), formatDate.nowDate(), this.keyword)
      },
      /* 获取近一年的统计数据 */
      getOneYearData () {
        this.curSelectBtn = 'oneYear'
        this.getCountData(formatDate.lastYearDate(), formatDate.nowDate(), this.keyword)
      },
      /* 按条件搜索统计数据 */
      searchDataByCondition () {
        // 判断输入时间的合法性
        if (!this.startTime) {
          this.$message({
//            message: NEED_SELECT_START_TIME,
            message: this.$t('NEED_SELECT_START_TIME'),
            type: 'warning'
          })
          return false
        }
        if (!this.endTime) {
          this.$message({
//            message: NEED_SELECT_END_TIME,
            message: this.$t('NEED_SELECT_END_TIME'),
            type: 'warning'
          })
          return false
        }
        if (this.startTime >= this.endTime) {
          this.$message({
//            message: NEED_LEGAL_START_TIME,
            message: this.$t('NEED_LEGAL_START_TIME'),
            type: 'warning'
          })
          return false
        }
        // 替换搜索文本框中的中文逗号为英文逗号
        if (this.keyword && this.keyword.toString().indexOf('，') != -1) {
          this.keyword.replace(/，/g, ',')
        }
        this.getCountData(this.startTime, this.endTime, this.keyword)
      },
      /* 点击会议次数图表的某一项，触发的时间 */
      meetingTimesChartClick () {
        this.conference.meetingUseTimes.on('click', (params) => {
          let paramsName = params.name
          this.commonOfChartClick(paramsName, (response) => {
            this.onlyRenderConferenceTab(response)
          })
        })
        this.concurrent.meetingConcurrent.on('click', (params) => {
          let paramsName = params.name
          this.commonOfChartClick(paramsName, (response) => {
            this.onlyRenderConcurrentTab(response)
          })
        })
      },
      /* 提取 点击图表事件 */
      commonOfChartClick (params, callback) {
        let requestData = {}
        // 横坐标为 年-月
        if (params.length > 0 && params.length <= 7) {
          requestData.startTime = `${params}-01 00:00:00`
          requestData.endTime = `${params}-31 23:59:59`
        } else {  // 横坐标为 年-月-日
          requestData.startTime = `${params} 00:00:00`
          requestData.endTime = `${params} 23:59:59`
        }
        if (this.keyword) requestData.orgList = this.keyword.replace(/，/g, ',')
        callback(requestData)
      },
      /* 只渲染会议室使用次数 表格 */
      onlyRenderConferenceTab (params) {
        api.statisticsUse.getConferenceData(params).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              let resData = responseData.data
              this.conference.meetingTimesData = resData.orgDetail
            } else {
              this.$message.error(responseData.message)
            }
          }
        })
      },
      /* 只渲染并发 表格 */
      onlyRenderConcurrentTab (params) {
        api.statisticsUse.getConcurrentData(params).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              let resData = responseData.data
              this.concurrent.concurrentData = resData.orgDetail
            } else {
              this.$message.error(responseData.message)
            }
          }
        })
      },
      /* 导出报表 */
      outputTable () {
        // 打开一个新窗口 这种方式可以解决浏览器阻止打开新窗口
        let newWindow = window.open()
        let language =
          localStorage.getItem('lang').indexOf('zh-CN') > -1
            ? 'CN' : 'EN'
        let requestData = {
          startTime: `${formatDate.formatOfDateStyle(this.startTime)} 00:00:00`,
          endTime: `${formatDate.formatOfDateStyle(this.endTime)} 00:00:00`,
          language
        }
        if (this.keyword) {
          requestData.orgList = this.keyword.replace(/，/g, ',')
        }
        // 获取报表 URL
        api.statisticsUse.getOutputURL(requestData).then(response => {
          let responseData = response.data
          if (responseData.code === '0') {
            let downloadURL = `${apiServer}${responseData.data.url}`
            newWindow.location.href = downloadURL
          } else {
            this.$message.error(responseData.message)
          }
        })
      }
    }
  }

  window.vueEvent.$on('reloadRouter', function() {
    if (window.self.getOneWeekData && window.self.meetingTimesChartClick) {
      window.self.getOneWeekData()
      window.self.meetingTimesChartClick()
    }
  })
</script>

<style lang="scss">
  @import "index.scss";
  /* version: V3.8
   * description:
   *    图表旁边的表格 对机构名称做处理.
   *    如果机构名称过长，使其显示在一行，超过的部显示省略号。
   */
  .echart-box-table-tbody-name {
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
