<template>
  <div class="header-nav">
    <img class="header-img" src="../assets/image/kunpeng.png">
    <el-dropdown class="dropdown" trigger="click">
      <div class="dropdown-link" @click="isLoginArrowsUp=!isLoginArrowsUp">
        <img class="dropdown-link-img" src="../assets/image/default-admin.png">
        <span class="user-name" v-text="userName"></span>
        <i class="el-icon-arrow-down el-icon--right dropdown-link-icon" v-if="isLoginArrowsUp"></i>
        <i class="el-icon-arrow-up el-icon--right dropdown-link-icon" v-else></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="changePassword">{{$t("CHANNEL_CHANGE_PASSWORD")}}</el-dropdown-item>
        <el-dropdown-item @click.native="logOut">{{$t("CHANNEL_EXIT_LOGON")}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="dropdown-lang" trigger="click">
      <div class="dropdown-link" @click="isLangArrosUp=!isLangArrosUp">
        <span v-if="choosedLang == 'cn'">{{$t("CHANNEL_LANGUAGE_CHINESE")}}</span>
        <span v-if="choosedLang == 'en'">{{$t("CHANNEL_LANGUAGE_ENGLISH")}}</span>
        <i class="el-icon-arrow-down el-icon--right dropdown-link-icon" v-if="isLangArrosUp"></i>
        <i class="el-icon-arrow-up el-icon--right dropdown-link-icon" v-else></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="chooseLanguage('zh')">{{$t("CHANNEL_LANGUAGE_CHINESE")}}</el-dropdown-item>
        <el-dropdown-item @click.native="chooseLanguage('en')">{{$t("CHANNEL_LANGUAGE_ENGLISH")}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import enLocale from 'element-ui/lib/locale/lang/en'
  import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
  import locale from 'element-ui/lib/locale'
  import {pickerOptions} from '../utils/global-data'
  export default {
    name: 'HeaderNav',
    data() {
      return {
        isLoginArrowsUp: true,
        isLangArrosUp: true,
        userName: sessionStorage.getItem('userName'),
        choosedLang: (localStorage.getItem('lang').indexOf('zh') > -1) ? 'cn' : 'en'
      }
    },
    methods: {
      // 修改密码
      changePassword() {
        this.$router.push({
          name: 'changePassword'
        })
      },
      // 退出登录
      logOut() {
        // 清空用户信息
        sessionStorage.removeItem('userName')
        sessionStorage.removeItem('channelId')
        sessionStorage.removeItem('accountId')
        sessionStorage.removeItem('userToken')
        // 跳转到登录页面
        this.$router.push({
          name: 'login'
        })
      },
      // 切换语言
      chooseLanguage(type) {
        if (type == 'zh') {
          document.title = '渠道管理系统'
          this.choosedLang = 'cn'
          this.$i18n.locale = 'zh-CN'
          localStorage.setItem('lang', 'zh-CN')
          locale.use(zhLocale)
        } else if (type == 'en') {
          document.title = 'Channel management system'
          this.choosedLang = 'en'
          this.$i18n.locale = 'en-US'
          localStorage.setItem('lang', 'en-US')
          locale.use(enLocale)
        }
        pickerOptions.shortcuts[0].text = this.$t('CHANNEL_HOME_Terminal_Statistics_Today')
        pickerOptions.shortcuts[1].text = this.$t('CHANNEL_HOME_Terminal_Statistics_Yesterday')
        pickerOptions.shortcuts[2].text = this.$t('CHNNNEL_WEEKDAY')
        window.vueEvent.$emit('reloadRouter')
      }
    }
  }
</script>

<style scoped lang="scss">
  /* 游离在 body 层 的下拉菜单 */
  .el-popper .popper__arrow {
    left: 73px !important;
  }
  .el-dropdown-menu {
    top: 40px !important;
    border: none;
    border-radius: 5px;
    padding: 0;

    .el-dropdown-menu__item {
      text-align: center;
      box-sizing: border-box;
      border-bottom: 1px solid rgb(228, 232, 241);
    }
    .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: rgba(228, 232, 241, .5);
    }
    // .triangle {
    //   position: absolute;
    //   right: 13px;
    //   top: -10px;
    //   width: 0;
    //   height: 0;
    //   border: 5px solid;
    //   border-color: transparent transparent white transparent;
    // }
  }
  @keyframes img-action {
    0% {
        left: 0;
    }
    100% {
        left: 300px;
    }
  }
  .header-nav {
    height: 50px;
    background: linear-gradient(rgb(0,169,254),rgb(8,146,249));
    .header-img {
      position: relative;
      animation: img-action 10s linear 2s infinite alternate;
      height: 50px;
    }
    .user-name {
      margin-left: 8px;
    }
    .dropdown {
      position: fixed;
      top: 0;
      right: 120px;
      // right: 50px;
      &-link {
        height: 50px;
        display: flex;
        align-items: center;
        color: white;
        cursor: pointer;
        /*width: 73px;*/
        justify-content: space-around;
        &-icon {
          /* 箭头icon 尺寸变小 */
          margin-top: 3px;
          font-size: 12px;
        }
      }
    }
    .dropdown-lang{
      position: fixed;
      top: 0;
      right: 30px;
      &-link {
        height: 50px;
        display: flex;
        align-items: center;
        color: white;
        cursor: pointer;
        &-img {
          height: 20px;
          width: 20px;
          margin-right: 5px;
        }
        &-icon {
          /* 箭头icon 尺寸变小 */
          margin-top: 3px;
          font-size: 12px;
        }
      }
    }
  }
</style>
