<template lang="html">
  <div class="not-found">
    <div class="right">
      <h2>抱歉，页面无法访问...</h2>
      <p class="des">可能原因：网址有错误 &gt; 请检查地址是否完整或存在多余字符；</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {}
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.not-found {
    position: absolute;
    top: 20%;
    bottom: 0;
    left: 20%;
    right: 0;
    background: url("../assets/image/earth.png") no-repeat;
}

.right {
    margin-top: 50px;
    margin-left: 300px;

    h2 {
        font-size: 24px;
        color: #373d41;
        letter-spacing: 0.8px;
        line-height: 36px;
        margin-bottom: 16px;
    }

    .des {
        width: 410px;
        height: 48px;
        font-size: 14px;
        color: #373d41;
        letter-spacing: 0.47px;
        line-height: 24px;
        margin-bottom: 20px;
    }
}
</style>
