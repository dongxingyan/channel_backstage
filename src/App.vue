<template>
<div class="app">
  <router-view></router-view>
</div>
</template>

<script>
import global from 'utils/global-data'
export default {
  name: 'app',
  created() {
    global.isExitUserInfo(this)
  }
}
</script>

<style lang="scss">
// element 成功时，绿色不好看，正哥说；
.el-form-item.is-success .el-input__inner {
    border-color: #c0c4cc;
    &:focus {
        border-color: #409eff;
        outline: 0;
    }
    &:hover {
        border-color: #c0c4cc;
    }
}
</style>
