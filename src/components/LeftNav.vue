<template>
  <div class="left-nav">
    <div class="logo">
      <img class="logo-img" src="../assets/image/logo-nav.png">
    </div>
    <el-menu class="main-menu" :default-active="curIndex" unique-opened router @open="openSubMenu">
      <el-menu-item @mouseover.native="mouseOverFun('home')" @mouseout.native="mouseOutFun" index="home" :route="{name: 'home'}" :style="menuLightingIndex === 'home' ? backStyle:''">
        <span v-show="isHeightLight('home')">
          <img class="icon-img" src="../assets/image/home-active.png">
          <img class="vertical-bar" src="../assets/image/vertical-bar.png">
        </span>
        <img v-show="!isHeightLight('home')" class="icon-img" src="../assets/image/home.png">
        <span>{{$t("CHANNEL_HOME_STATUS")}}</span>
      </el-menu-item>
      <el-menu-item @mouseover.native="mouseOverFun('customer')" @mouseout.native="mouseOutFun" index="customer" :route="{name: 'customer'}" :style="menuLightingIndex === 'customer' ? backStyle:''">
        <span v-show="isHeightLight('customer')">
          <img class="icon-img" src="../assets/image/customer-active.png">
          <img class="vertical-bar" src="../assets/image/vertical-bar.png">
        </span>
        <img v-show="!isHeightLight('customer')" class="icon-img" src="../assets/image/customer.png">
        <span>{{$t("CHANNEL_CUSTOMER_MANAGEMENT")}}</span>
      </el-menu-item>
      <el-menu-item @mouseover.native="mouseOverFun('conference')" @mouseout.native="mouseOutFun" index="conference" :route="{name: 'conference'}" :style="menuLightingIndex === 'conference' ? backStyle:''">
        <span v-show="isHeightLight('conference')">
          <img class="icon-img" src="../assets/image/conference-active.png">
          <img class="vertical-bar" src="../assets/image/vertical-bar.png">
        </span>
        <img v-show="!isHeightLight('conference')" class="icon-img" src="../assets/image/conference.png">
        <span>{{$t("CHANNEL_MEETINGROOM_MANAGEMENT")}}</span>
      </el-menu-item>
      <el-menu-item @mouseover.native="mouseOverFun('terminal')" @mouseout.native="mouseOutFun" index="terminal" :route="{name: 'terminal'}" :style="menuLightingIndex === 'terminal' ? backStyle:''">
        <span v-show="isHeightLight('terminal')">
          <img class="icon-img" src="../assets/image/terminal-active.png">
          <img class="vertical-bar" src="../assets/image/vertical-bar.png">
        </span>
        <img v-show="!isHeightLight('terminal')" class="icon-img" src="../assets/image/terminal.png">
        <span>{{$t("CHANNEL_TERMINAL_ACCOUNT")}}</span>
      </el-menu-item>
      <el-submenu @mouseover.native="mouseOverFun('statistics')" @mouseout.native="mouseOutFun" index="statistics" :style="menuLightingIndex === 'statistics' ? backStyle:''">
        <template slot="title">
          <span v-show="isHeightLight('statistics')">
            <img class="icon-img" src="../assets/image/statistics-active.png">
            <img class="vertical-bar" src="../assets/image/vertical-bar.png">
          </span>
          <img v-show="!isHeightLight('statistics')" class="icon-img" src="../assets/image/statistics.png">
          <span>{{$t("CHANNEL_STATISTICS")}}</span>
        </template>
        <el-menu-item index="use" :route="{name: 'use'}">{{$t("CHANNEL_USE_STATISTICS")}}</el-menu-item>
        <el-menu-item index="live" :route="{name: 'live'}">{{$t("CHANNEL_LIVE_STATISTICS")}}</el-menu-item>
      </el-submenu>
      <!-- <el-submenu @mouseover.native="mouseOverFun('customization')" @mouseout.native="mouseOutFun" v-if="isCustomized" index="customization" :style="menuLightingIndex==='customization' ? backStyle:''">
        <template slot="title">
          <span v-show="isHeightLight('customization')">
            <img class="icon-img" src="../assets/image/customization-active.png">
            <img class="vertical-bar" src="../assets/image/vertical-bar.png">
          </span>
          <img v-show="!isHeightLight('customization')" class="icon-img" src="../assets/image/customization.png">
          <span>{{$t("CHANNEL_PORTAL_INTERFACE")}}</span>
        </template>
        <el-menu-item index="admin" :route="{name: 'admin'}">{{$t("CHANNEL_CUSTOMER_SYSTEM")}}</el-menu-item>
        <el-menu-item index="meeting" :route="{name: 'meeting'}">{{$t("CHANNEL_WEB_BROWSER")}}</el-menu-item>
        <el-menu-item index="ios" :route="{name: 'ios'}">{{$t("CHANNEL_IOS_CLIENT")}}</el-menu-item>
        <el-menu-item index="android" :route="{name: 'android'}">{{$t("CHANNEL_ANDROID_CLIENT")}}</el-menu-item>
        <el-menu-item index="pc" :route="{name: 'pc'}">{{$t("CHANNEL_PC_CLIENT")}}</el-menu-item>
      </el-submenu>
      <el-submenu @mouseover.native="mouseOverFun('enterprise')" @mouseout.native="mouseOutFun" v-if="isCustomized" index="enterprise" :style="menuLightingIndex==='enterprise' ? backStyle:''">
        <template slot="title">
          <span v-show="isHeightLight('enterprise')">
            <img class="icon-img" src="../assets/image/hardware-active.png">
            <img class="vertical-bar" src="../assets/image/vertical-bar.png">
          </span>
          <img v-show="!isHeightLight('enterprise')" class="icon-img" src="../assets/image/hardware.png">
          <span>{{$t("CHANNEL_HARDWARE_INTERFACE")}}</span>
        </template>
        <el-menu-item index="boxes" :route="{name: 'boxes'}">{{$t("CHANNEL_HARDWARE_MANAGE")}}</el-menu-item>
        <el-menu-item index="apk" :route="{name: 'apk'}">{{$t("CHANNEL_CUSTOM_APK")}}</el-menu-item>
        <el-menu-item index="tofu" :route="{name: 'tofu'}">{{$t("CHANNEL_BEAN_BLOCK")}}</el-menu-item>
        <el-menu-item index="screen" :route="{name: 'screen'}">{{$t("CHANNEL_FIRST_SCREEN")}}</el-menu-item>
        <el-menu-item index="defaultScreen" :route="{name: 'defaultScreen'}">{{$t("CHANNEL_DEFAULT_HEAD_SCREEN")}}</el-menu-item>
        <el-menu-item index="videoConference" :route="{name: 'videoConference'}">{{$t("CHANNEL_ENTERPRISE_VIDEO")}}</el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>

<script>
  import api from 'api/index'
  import global from 'utils/global-data'
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'LeftNav',
    data() {
      return {
        curIndex: 'home', // 点击选中菜单标识
        menuLightingIndex: 'home', // 菜单路由高亮
        hoverIndex: '', // 悬浮状态菜单标识
        isCustomized: 0,
        backStyle: {
          background: `#f2f6fe`
        }
      }
    },
    watch: {
      $route(nval) {
        this.curIndex = nval.name
        this.menuLightingIndex = nval.meta.routeMenu
      }
    },
    created() {
      // 根据路由信息判断当前哪个菜单被选中
      this.curIndex = this.$route.name
      // this.menuLightingIndex = this.$route.path.replace(/\/main\//, '').replace(/\/.*/, '')
      this.menuLightingIndex = this.$route.meta.routeMenu
      // 判断是否显示定制化
      this.judgeCustomized()
      window.onresize = () => {
        // 改变子菜单 内部滚动
        // this.getSubMenuMaxHeight()
      }
    },
    methods: {
      ...mapMutations(['SET_CUSTOMIZED']),
      getSubMenuMaxHeight() {
        let logoHeight = 71
        let menuHeight = 45 * 7
        let subMenuMaxHeight = document.querySelector('.left').clientHeight - logoHeight - menuHeight
        document.querySelector('.el-submenu.is-opened > .el-menu').style.maxHeight = `${subMenuMaxHeight}px`
      },
      openSubMenu(index, indexPath) {
        // 防止子菜单展开，内容溢出
        // subMenuMaxHeight = document.querySelector('.left').clientHeight - logoHeight - menuHeight
        // event 事件源可能是 菜单 也可能是箭头
        this.$nextTick(() => {
          // this.getSubMenuMaxHeight()
        })
      },
      // 判断是否显示定制化导航
      judgeCustomized() {
        let requestData = {
          channelId: sessionStorage.getItem('channelId')
        }
        api.home.getChannelInfo(requestData).then((response) => {
          let responseData = response.data
          if (responseData.code === '0') {
            this.isCustomized = responseData.data.isCustomized
            this.SET_CUSTOMIZED(this.isCustomized)
          }
        })
      },
      mouseOverFun(index) {
        this.hoverIndex = index
      },
      mouseOutFun() {
        this.hoverIndex = ''
      },
      isHeightLight(index) {
        return this.hoverIndex === index || this.menuLightingIndex === index
      }
    }
  }
</script>

<style lang="scss">
.left-nav {
    .logo {
        padding: 15px 10px 28px 25px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: white;

        &-img {
            // logo-img 109 * 33
            max-width: 100px;
            max-height: 30px;
        }
    }

    .main-menu {
        background-color: white;
        border: none;

        & > .el-menu-item,
        & > .el-submenu > .el-submenu__title {
            // 表面上的 一列菜单 // 默认56px
            // height: 50px;
            // line-height: 50px;
            height: 45px;
            line-height: 45px;
            padding-left: 30px !important;
            color: #7b8292;
            &:hover {
                background: rgba(242,246,254,1);
            }
        }

        & > .el-menu-item.is-active,
        & > .el-submenu.is-opened > .el-submenu__title {
            // 表面上一列菜单点中后颜色
            color: #474545;
        }

        // 子菜单展开超出滚动
        .el-submenu {

            /*
          定义子菜单的最大高度，从而滚动,可以避免内容超出屏幕, 每个子菜单内容项不一样，具体而定max-height;
          阿里的max-height 是通过计算动态得出的
          */

            .el-menu{
              // 200px 是为了将滚动条 看不见
              width: 200px;
              overflow-y: scroll;
              overflow-x: hidden;
            }

              .el-menu-item {
                // 子菜单的 每一项menu // 原始50px
                // height: 45px;
                // line-height: 45px;
                height: 40px;
                line-height: 40px;
                padding-left: 60px !important;
                background-color: rgba(230,238,252,1);
                &:hover {
                    // 将悬浮色改变为背景色
                    color: rgba(58,146,241,1);
                    background-color: rgba(230,238,252,1);
                }
            }
        }

        .icon-img {
            width: 12px;
            height: 12px;
            margin-right: 16px;
        }

        .vertical-bar {
            // 竖条
            position: absolute;
            left: 4px;
            top: 12px;
        }
    }
}
</style>
