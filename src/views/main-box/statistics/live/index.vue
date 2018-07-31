<template lang="html">
  <div class="statistics-live">
    <div class="header">
      <span class="header-title">{{$t('CHANNEL_LIVE_STATISTICS')}}</span>
      <el-row class="header-statistics live" :gutter="10">
        <el-col :span="9">
          <el-button-group>
            <el-button type="infor" @click="getTodayData" :style="curSelectBtn === 'today'? btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_Today')}}</el-button>
            <el-button type="infor" @click="getYesterdayData" :style="curSelectBtn === 'yesterday'? btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_Yesterday')}}</el-button>
            <el-button type="infor" @click="getWeekData" :style="curSelectBtn === 'week'? btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_7Days')}}</el-button>
            <el-button type="infor" @click="getMonthData":style="curSelectBtn === 'month'? btnBackStyle:{}">{{$t('CHANNEL_HOME_Terminal_Statistics_30Days')}}</el-button>
          </el-button-group>
        </el-col>

        <el-col :span="12">
          <el-date-picker :picker-options="pickerOptions" v-model="startTime" :placeholder="$t('CHANNEL_HOME_Terminal_Statistics_selectDate')" type="date"></el-date-picker>
          <span>{{$t('CHANNEL_HOME_Terminal_Statistics_to')}}</span>
          <el-date-picker :picker-options="pickerOptions" v-model="endTime" :placeholder="$t('CHANNEL_HOME_Terminal_Statistics_selectDate')" type="date"></el-date-picker>
          <el-button type="text" @click="searchData">{{$t('CHANNEL_HOME_MANAGEMENT_Search')}}</el-button>
        </el-col>

        <el-col :span="2">
          <el-button type="text" @click="outputTable">{{$t('CHANNEL_HOME_Terminal_Statistics_Export')}}</el-button>
        </el-col>
      </el-row>

      <div v-show="!isEmptyOfConcurrent" class="no-data-container">
        <span>{{$t('CHANNEL_HOME_Terminal_Statistics_Concurrent')}}</span>
        <NoData/>
      </div>

      <el-row v-show="isEmptyOfConcurrent" class="echart-box">
        <el-col class="echart-box-content" id="live-concurrent" :span="24" ></el-col>
      </el-row>

      <div v-show="!isEmptyOfUserZone" class="no-data-container">
        <span>{{$t('CHANNEL_HOME_Terminal_Statistics_User')}}</span>
        <NoData/>
      </div>

      <el-row v-show="isEmptyOfUserZone" class="echart-box">
        <el-col class="echart-box-content" id="live-user-region" :span="24" ></el-col>
      </el-row>

      <div v-show="!isEmptyOfUserDevice" class="no-data-container">
        <span>{{$t('CHANNEL_HOME_Terminal_Statistics_User_Terminal')}}</span>
        <NoData/>
      </div>

      <el-row v-show="isEmptyOfUserDevice" class="echart-box">
        <el-col class="echart-box-content" id="live-user-device" :span="24" ></el-col>
      </el-row>

      <div v-show="!isEmptyOfBrowser" class="no-data-container">
        <span>{{$t('CHANNEL_HOME_Terminal_Statistics_User_Browser')}}</span>
        <NoData/>
      </div>

      <el-row v-show="isEmptyOfBrowser" class="echart-box">
        <el-col class="echart-box-content" id="live-browser-version" :span="24" ></el-col>
      </el-row>

      <div v-show="!isEmptyOfFlow" class="no-data-container">
        <span>{{$t('CHANNEL_HOME_Terminal_Statistics_Flow_GB')}}</span>
        <NoData/>
      </div>

      <el-row v-show="isEmptyOfFlow" class="echart-box">
        <el-col class="echart-box-content" id="live-flow" :span="24" ></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import api from 'api/index'
  import globalData from 'utils/global-data'
  import formatDate from 'utils/format-date'
  import NoData from 'components/NoData.vue'
  import echarts from 'echarts'
  import { apiServer } from 'configuration/index'
//  import { NEED_SELECT_START_TIME, NEED_SELECT_END_TIME, NEED_LEGAL_START_TIME_LIVE } from 'configuration/global-const'

  export default {
    name: 'StatisticsLive',
    created () {
    },
    components: {
      NoData
    },
    data() {
      return {
        startTime: '',
        endTime: '',
        pickerOptions: globalData.pickerOptions,
        liveConcurrent: '',
        liveUserRegion: '',
        liveUserDevice: '',
        liveBrowser: '',
        liveFlow: '',
        isEmptyOfConcurrent: true,
        isEmptyOfUserZone: true,
        isEmptyOfUserDevice: true,
        isEmptyOfBrowser: true,
        isEmptyOfFlow: true,
        btnBackStyle: {
          background: `#31a3dd`,
          color: `white`
        },
        curSelectBtn: 'today'
      }
    },
    mounted () {
      this.liveConcurrent = echarts.init(document.getElementById('live-concurrent'))
      this.liveUserRegion = echarts.init(document.getElementById('live-user-region'))
      this.liveUserDevice = echarts.init(document.getElementById('live-user-device'))
      this.liveBrowser = echarts.init(document.getElementById('live-browser-version'))
      this.liveFlow = echarts.init(document.getElementById('live-flow'))
      // 获取“今天”统计数据
      this.getTodayData()
      window.self = this
    },
    methods: {
      /* 获取统计的数据 */
      getCountData (startTime, endTime) {
        // 设置开始时间、结束时间
        this.startTime = `${formatDate.formatOfDateStyle(startTime)}`
        this.endTime = `${formatDate.formatOfDateStyle(endTime)}`
        // 格式化 开始、结束时间
        startTime = `${formatDate.formatOfDateStyle(startTime)} 00:00:00`
        endTime = `${formatDate.formatOfDateStyle(endTime)} 23:59:59`
        // 加载图表loading
        this.liveConcurrent.showLoading()
        this.liveUserRegion.showLoading()
        this.liveUserDevice.showLoading()
        this.liveBrowser.showLoading()
        this.liveFlow.showLoading()
        // 获取请求参数
        let requestData = {
          startTime: startTime,
          endTime: endTime
        }
        // 获取使用统计相关数据
        api.statisticsLive.getLiveCountData(requestData).then(response => {
          if (response.data) {
            let responseData = response.data
            if (responseData.code === '0') {
              let resData = responseData.data
              setTimeout(() => {
                // 渲染并发数、流量统计图表
                if (resData.timeline) {
                  this.isEmptyOfConcurrent = true
                  this.isEmptyOfFlow = true
                  // 渲染并发数统计图表
                  this.renderConcurrentChart(resData.timeline)
                  // 渲染流量统计图表
                  this.renderFlowChart(resData.timeline)
                } else {
                  this.isEmptyOfConcurrent = false
                  this.isEmptyOfFlow = false
                }
              }, 500)
              setTimeout(() => {
                // 渲染用户分布地区统计图表
                if (resData.region) {
                  this.isEmptyOfUserZone = true
                  this.renderUserZoneChart(resData.region)
                } else {
                  this.isEmptyOfUserZone = false
                }
              }, 1000)
              setTimeout(() => {
                // 渲染用户设备统计图表
                if (resData.device) {
                  this.isEmptyOfUserDevice = true
                  this.renderUserDeviceChart(resData.device)
                } else {
                  this.isEmptyOfUserDevice = false
                }
              }, 2000)
              setTimeout(() => {
                // 渲染浏览器版本统计图表
                if (resData.browser) {
                  this.isEmptyOfBrowser = true
                  this.renderBrowserVersionChart(resData.browser)
                } else {
                  this.isEmptyOfBrowser = false
                }
              }, 3000)
            } else {
              this.$message.error(responseData.message)
              this.isEmptyOfConcurrent = false
              this.isEmptyOfFlow = false
              this.isEmptyOfUserZone = false
              this.isEmptyOfUserDevice = false
              this.isEmptyOfBrowser = false
            }
          }
        }).catch(error => {
          this.$message.error(error.toString())
        })
      },
      /* 渲染并发数量图表 */
      renderConcurrentChart (data) {
        this.liveConcurrent.hideLoading()
        let option = {
          color: [
            '#f36f6d'
          ],
          toolbox: {
            show: true,
            right: '30px',
            feature: {
              magicType: {show: true, type: ['line', 'bar']}
            }
          },
          title: {
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_Concurrent_MM'),
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                width: '30px',
                opacity: 0.8
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              data: data ? data.map((item) => {
                return item.time
              }) : '',
              axisTick: {
                alignWithLabel: true,
                interval: 0
              },
              axisLabel: {
                interval: 0,
                rotate: 30
              },
              boundaryGap: true
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Concurrent_MM'),
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              barMaxWidth: '25px',
              data: data ? data.map((item) => {
                return item.simultaneous
              }) : ''
            }
          ]
        }
        this.liveConcurrent.setOption(option)
      },
      /* 渲染用户分布地区图表 */
      renderUserZoneChart (data) {
        this.liveUserRegion.hideLoading()
        let userZoneOption = {
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
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_User'),
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                width: '30px',
                opacity: 0.8
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true,
                interval: 0
              },
              axisLabel: {
                interval: 0,
                rotate: 30
              },
              boundaryGap: true,
              data: data ? data.map((item) => {
                return item.name
              }) : ''
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              size: ['60%', '60%'],
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Number_Of_People'),
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              barMaxWidth: '25px',
              data: data ? data.map((item) => {
                return item.value
              }) : ''
            }
          ]
        }
        this.liveUserRegion.setOption(userZoneOption)
      },
      /* 渲染用户设备图表 */
      renderUserDeviceChart (data) {
        this.liveUserDevice.hideLoading()
        let userDeviceOption = {
          color: [
            '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'
          ],
          title: {
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_User_Terminal'),
            'x': 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: '25%',
            data: data ? data.map((item) => {
              return item.name
            }) : ''
          },
          series: [
            {
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Access_Source'),
              type: 'pie',
              radius: '70%',
              center: ['50%', '50%'],
              data: data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        this.liveUserDevice.setOption(userDeviceOption)
      },
      /* 渲染浏览器版本图表 */
      renderBrowserVersionChart (data) {
        this.liveBrowser.hideLoading()
        let browserVersionOption = {
          color: [
            '#f36f6d'
          ],
          toolbox: {
            show: true,
            right: '30px',
            feature: {
              magicType: {show: true, type: ['line', 'bar']}
            }
          },
          title: {
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_User_Browser'),
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                width: '30px',
                opacity: 0.8
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true,
                interval: 0
              },
              axisLabel: {
                interval: 0,
                rotate: 30
              },
              boundaryGap: true,
              data: data ? data.map((item) => {
                return item.name
              }) : ''
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Number'),
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              barMaxWidth: '25px',
              data: data ? data.map((item) => {
                return item.value
              }) : ''
            }
          ]
        }
        this.liveBrowser.setOption(browserVersionOption)
      },
      /* 渲染流量图表 */
      renderFlowChart (data) {
        this.liveFlow.hideLoading()
        let flowOption = {
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
            text: this.$t('CHANNEL_HOME_Terminal_Statistics_Flow_GB'),
            x: 'center'
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: '#e8f4fe',
                width: '30px',
                opacity: 0.8
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true,
                interval: 0
              },
              axisLabel: {
                interval: 0,
                rotate: 30
              },
              boundaryGap: true,
              data: data ? data.map((item) => {
                return item.time
              }) : ''
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.$t('CHANNEL_HOME_Terminal_Statistics_Flow_GB'),
              type: 'line',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              barMaxWidth: '25px',
              data: data ? data.map((item) => {
                let traffic = item.traffic.toString()
                traffic = traffic.indexOf(',') > -1 ? traffic.replace(/,/g, '') : traffic
                return traffic
              }) : ''
            }
          ]
        }
        this.liveFlow.setOption(flowOption)
      },
      /* 获取“今天”统计数据 */
      getTodayData () {
        this.curSelectBtn = 'today'
        this.getCountData(formatDate.nowDate(), formatDate.nowDate())
      },
      /* 获取“昨天”统计数据 */
      getYesterdayData () {
        this.curSelectBtn = 'yesterday'
        this.getCountData(formatDate.yesterday(), formatDate.yesterday())
      },
      /* 获取“近一周”统计数据 */
      getWeekData () {
        this.curSelectBtn = 'week'
        this.getCountData(formatDate.lastWeekDate(), formatDate.nowDate())
      },
      /* 获取“近一月”统计数据 */
      getMonthData () {
        this.curSelectBtn = 'month'
        this.getCountData(formatDate.lastMonthDate(), formatDate.nowDate())
      },
      /* 搜索统计数据 */
      searchData () {
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
        if (this.startTime > this.endTime) {
          this.$message({
//            message: NEED_LEGAL_START_TIME_LIVE,
            message: this.$t('NEED_LEGAL_START_TIME_LIVE'),
            type: 'warning'
          })
          return false
        }
        this.getCountData(this.startTime, this.endTime)
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
          endTime: `${formatDate.formatOfDateStyle(this.endTime)} 23:59:59`,
          language
        }
        // 获取报表 URL
        api.statisticsLive.getOutputURL(requestData).then(response => {
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
    if (window.self.getTodayData) {
      window.self.getTodayData()
    }
  })
</script>


<style lang="scss">
  @import "index.scss";
</style>
