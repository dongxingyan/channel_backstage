<template lang="html">
  <div class="terminal-account">
    <div class="header">
      <span class="header-title">{{$t('CHANNEL_HOME_Terminal_TerminalAccount')}}</span>

      <el-form class="header-form" :model="searchForm" inline label-width="70px">
        <el-form-item :label="$t('CHANNEL_HOME_MANAGEMENT_Keyword')">
          <el-input style="width: 205px;"  v-model="searchForm.keyword" :placeholder="$t('CHANNEL_HOME_Terminal_SearchTip')"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button class="btn-gradient-blue" type="text" @click="searchClick">{{$t('CHANNEL_HOME_MANAGEMENT_Search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table class="data-table" :data="tableData" border row-key="id" v-loading="loading">
      <el-table-column :label="$t('CHANNEL_HOME_Terminal_Terminal')" prop="pexipName"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Terminal_Owner')" prop="orgName"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Terminal_URI')" prop="accountAlias"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_Terminal_Password')" prop="pexipPassword"></el-table-column>
      <el-table-column :label="$t('CHANNEL_HOME_MANAGEMENT_Operate')">
        <template slot-scope="scope">
          <span class="alter-span" @click="updateTeminal(scope)">{{$t('CHANNEL_HOME_MANAGEMENT_Edit')}}</span>
          <span class="alter-span" @click="showCode(scope)">{{$t('CHANNEL_HOME_MANAGEMENT_Code')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pager-pagination" :total="totalSize" :current-page.sync="curPage" @current-change="pageChange" layout="total, slot, prev, pager, next, jumper">
      <span class="page-size-tip">{{$t('CHANNEL_PUBLIC_PREPAGE')}} {{pageSizes}} {{$t('CHANNEL_PUBLIC_ROW')}}</span>
    </el-pagination>

    <!-- 修改客户页面 dialog -->
    <el-dialog :title="$t('CHANNEL_HOME_Terminal_EDIT_TIP')" :visible.sync="dialogVisible">
      <el-row>
        <el-col :span="16">
          <el-form :model="updateTerminalForm" label-width="200px">
            <el-form-item :label="$t('CHANNEL_HOME_Terminal_EDIT_TerminalAccount')">
              <span>{{updateTerminalForm.pexipName}}</span>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_Terminal_EDIT_Owner')">
              <span>{{updateTerminalForm.orgName}}</span>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_Terminal_EDIT_URI')">
              <span>{{updateTerminalForm.accountAlias}}</span>
            </el-form-item>
            <el-form-item :label="$t('CHANNEL_HOME_Terminal_EDIT_Password')">
              <el-input v-model="updateTerminalForm.pexipPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="margin-left: -20px;">
                <el-button class="btn-gradient-blue" type="text" @click="teminalSave">{{$t('CHANNEL_HOME_MANAGEMENT_SAVE')}}</el-button>
                <el-button class="btn-gradient-orange" type="text" @click="teminalCancel">{{$t('CHANNEL_HOME_MANAGEMENT_CANCEL')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 弹出二维码 dialog -->
    <el-dialog :title="$t('CHANNEL_HOME_MANAGEMENT_QR_Info')" :visible.sync="dialogCodeVisible">
      <el-row>
        <el-col :span="24">
          <el-form style="text-align: center" >
            <!--startprint-->
            <img :src="codeSrc" width="200px" height="200px" alt="">
            <!--endprint-->
            <el-form-item style="display:flex;justify-content: center">
              <div>
                <a id="download-code"></a>
                <el-button class="btn-gradient-blue" type="text" @click="downloadCode">{{$t('CHANNEL_HOME_CLIENT_DOWNLAOD')}}</el-button>
                <el-button class="btn-gradient-blue" type="text" @click="printCode">{{$t('CHANNEL_HOME_CLIENT_PRINT')}}</el-button>
                <el-button class="btn-gradient-orange" type="text" @click="hideCodeDialog">{{$t('CHANNEL_HOME_MANAGEMENT_CANCEL')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import api from 'api'
  import { apiServer, imagePath } from 'configuration/index'

  export default {
    name: 'TerminalAccount',
    data() {
      return {
        searchForm: {
          keyword: ''
        },
        tableData: [],
        dialogVisible: false,
        dialogCodeVisible: false,
        updateTerminalForm: {},
        pageSizes: 10,
        curPage: 1,
        totalSize: 100,
        loading: true,
        codeSrc: ''
      }
    },
    created() {
      // 初次获取终端账号
      this.getTeminalAccount({
        channelId: sessionStorage.channelId,
        start: this.curPage,
        size: this.pageSizes
      })
    },
    methods: {
      /* 修改teminal账号，传递当前行数据进入dialog => {...data} */
      updateTeminal({
        row,
        $index
      }) {
        this.dialogVisible = true
        this.updateTerminalForm = { ...row,
          $index
        }
      },
      teminalSave() {
        // 修改成功，将password联动回table ;获取修改行数据的index 和 pass
        let curIndex = this.updateTerminalForm.$index
        let newPassword = this.updateTerminalForm.pexipPassword
        let pexipName = this.updateTerminalForm.pexipName

        // user api
        api.teminal.alterTeminalPassword({
          channelId: sessionStorage.channelId,
          id: this.updateTerminalForm.id,
          password: newPassword,
          pexipName: pexipName
        }).then((res) => {
          this.dialogVisible = false
          if (res.data.code === '0') {
            this.tableData[curIndex].pexipPassword = newPassword
            this.$message({
              type: 'success',
              message: this.$t('CHANNEL_MODIFY_SUCCESS')
            })
          } else {
            this.$message({
              type: 'error',
              message: this.$t('CHANNEL_SERVER_ERROR')
            })
          }
        }).catch((err) => {
          this.dialogVisible = false
          this.$message({
            type: 'error',
            message: err.toString()
          })
        })
      },
      teminalCancel() {
        this.dialogVisible = false
        // 取消修改，因为数据是同一个对象
      },
      // 搜索表单操作
      searchClick() {
        this.getTeminalAccount({
          keyword: this.searchForm.keyword,
          channelId: sessionStorage.channelId,
          start: this.curPage,
          size: this.pageSizes
        })
      },
      pageChange() {
        // 页码改变
        this.getTeminalAccount({
          keyword: this.searchForm.keyword,
          channelId: sessionStorage.channelId,
          start: this.curPage,
          size: this.pageSizes
        })
      },
      getTeminalAccount(params) {
        api.teminal.getTeminalAccount(params).then(res => {
          if (res.data.code === '0') {
            // ok
            let data = res.data.data
            this.tableData = data.resultList
            this.totalSize = data.totalSize
            this.loading = false
          } else {
            this.loading = false
            this.$message({
              type: 'error',
              message: this.$t('CHANNEL_SERVER_ERROR')
            })
          }
        }).catch((err) => {
          this.loading = false
          this.$message.error(err.toString())
        })
      },
      // 点击显示二维码弹框
      showCode({row}) {
        this.dialogCodeVisible = true
        console.log('hahah')
        console.log(row)
        console.log(imagePath)
        if (row.qrcode) {
          console.log(imagePath)
          this.codeSrc = imagePath + {...row}.qrcode
        } else {
          this.codeSrc = 'https://channel-dev.cloudp.cc/file/pic/terminal/1/1532143656.jpg'
        }
      },
      hideCodeDialog() {
        this.dialogCodeVisible = false
      },
      // 下载二维码
      downloadCode() {
        if (this.myBrowser() === 'IE' || this.myBrowser() === 'Edge') {
          this.SaveAs5(this.codeSrc)
        } else {
          this.download(this.codeSrc)
        }
      },
      // 打印二维码
      printCode() {
        let bdhtml = window.document.body.innerHTML
        let sprnstr = '<!--startprint-->'
        let eprnstr = '<!--endprint-->'
        let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17)
        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr))
        // window.document.body.innerHTML=prnhtml;
        // window.print();
        var newWindow = window.open('', '_blank')
        newWindow.document.body.innerHTML = prnhtml
        newWindow.document.close()
        setTimeout(function() {
          newWindow.print()
          newWindow.close()
        }, 100)
      },
      // IE浏览器中保存
      SaveAs5(imgURL) {
        let oPop = window.open(imgURL, '', 'width=1, height=1, top=5000, left=5000')
        for (; oPop.document.readyState != 'complete';) {
          if (oPop.document.readyState == 'complete') break
        }
        oPop.document.execCommand('SaveAs')
        oPop.close()
      },
      // 非IE
      download(src) {
        var $a = document.getElementById('download-code')
        $a.setAttribute('href', src)
        $a.setAttribute('download', '')
        $a.click()
      },
      // 判断浏览器类型
      myBrowser() {
        var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1
        if (isOpera) {
          return 'Opera'
        } // 判断是否Opera浏览器
        if (userAgent.indexOf('Firefox') > -1) {
          return 'FF'
        } // 判断是否Firefox浏览器
        if (userAgent.indexOf('Chrome') > -1) {
          return 'Chrome'
        }
        if (userAgent.indexOf('Safari') > -1) {
          return 'Safari'
        } // 判断是否Safari浏览器
        if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
          return 'IE'
        } // 判断是否IE浏览器
        if (userAgent.indexOf('Trident') > -1) {
          return 'Edge'
        } // 判断是否Edge浏览器
      }
    }
  }
</script>

<style lang="scss">
  @import "index.scss";
</style>
