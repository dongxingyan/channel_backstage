<template lang="html">
  <div class="main-box">
    <div class="left">
      <LeftNav></LeftNav>
    </div>

    <div class="right">
      <div class="right-header-container">
        <HeaderNav />
      </div>
      <transition name="el-zoom-in-center" appear>
        <div class="content">
          <!--<keep-alive include="StatisticsUse,StatisticsLive">-->
            <router-view></router-view>
          <!--</keep-alive>-->
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import HeaderNav from 'components/HeaderNav.vue'
import LeftNav from 'components/LeftNav.vue'
export default {
  name: 'mainBox',
  data() {
    return {

    }
  },
  components: {
    HeaderNav,
    LeftNav
    // 'HeaderNav': () => import('components/HeaderNav.vue'),
    // 'LeftNav': () => import('components/LeftNav.vue')
  }
}
</script>

<style lang="scss">
  @import "index.scss";
</style>
