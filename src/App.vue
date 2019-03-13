<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    mounted() {
      var docEl = document.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          if (clientWidth >= 640) {
            docEl.style.fontSize = '100px';
          } else {
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
          }
        };

      if (!document.addEventListener) return;
      window.addEventListener(resizeEvt, recalc, false);
      document.addEventListener('DOMContentLoaded', recalc, false);
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    margin-top: 40px;
  }

  /**::-webkit-scrollbar {
      width: 6px;
      height:6px;
    }
    *::-webkit-scrollbar-track {
        background-color: #F1F1F1;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
    }
    *::-webkit-scrollbar-thumb {
        background-color: #C1C1C1;
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
    }*/

  .icon.picture-red {
    background-image: url(assets/image/icon/图片-red.svg);
  }

  .icon.text-red {
    background-image: url(assets/image/icon/文稿-red.svg);
  }

  .icon.video-red {
    background-image: url(assets/image/icon/音视频-red.svg);
  }

  .icon.save {
    background-image: url(assets/image/icon/保存.svg);
  }

  .icon.edit {
    background-image: url(assets/image/icon/编辑.svg);
  }

  .icon.label {
    background-image: url(assets/image/icon/标签.svg);
  }

  .icon.preaudit {
    background-image: url(assets/image/icon/待审.svg);
  }

  .icon.persons {
    background-image: url(assets/image/icon/多人.svg);
  }

  .icon.back {
    background-image: url(assets/image/icon/返回.svg);
  }

  .icon.more {
    background-image: url(assets/image/icon/更多.svg);
  }

  .icon.selected {
    background-image: url(assets/image/icon/勾（选择）.svg);
  }

  .icon.clear {
    background-image: url(assets/image/icon/清空.svg);
  }

  .icon.calendar {
    background-image: url(assets/image/icon/日历.svg);
  }

  .icon.search {
    background-image: url(assets/image/icon/搜索.svg);
  }

  .icon.submit {
    background-image: url(assets/image/icon/提交.svg);
  }

  .icon.btn-pidProductStatusDelete {
    background-image: url(assets/image/icon/删除2.svg);
  }

  .icon.btn-pidProductStatusUpdate {
    background-image: url(assets/image/icon/修改.svg);
  }

  .icon.btn-pidProductStatusShare {
    background-image: url(assets/image/icon/分享.svg);
  }

  .icon.btn-pidProductStatusAssignRevoke {
    background-image: url(assets/image/icon/撤销.svg);
  }

  .icon.btn-pidProductStatusAssign {
    background-image: url(assets/image/icon/签发.svg);
  }

  .icon.btn-pidProductStatusMove {
    background-image: url(assets/image/icon/移动.svg);
  }

  .icon.btn-pidProductCgAudit {
    background-image: url(assets/image/icon/提交审核.svg);
  }

  .icon.btn-pidProductStatusDownload {
    background-image: url(assets/image/icon/下载.svg);
  }

  .icon.btn-pidProductStatusAudit {
    background-image: url(assets/image/icon/审核2.svg);
  }

  .icon.btn-pidProductStatusUnlock {
    background-image: url(assets/image/icon/解锁.svg);
  }

  .icon.btn-pidProductCollect {
    background-image: url(assets/image/icon/已收藏.svg);
  }

  .icon.btn-pidProductUncollect {
    background-image: url(assets/image/icon/取消收藏.svg);
  }

  .mint-indicator-wrapper {
    height: 40px;
  }

  .mint-indicator-spin {
    margin-bottom: 150%;
  }

  .head-hidden {
    margin-top: 0px !important;
  }

  .inline {
    display: inline;
  }

  .inline-block {
    display: inline-block;
  }

  .pull-left {
    float: left !important;
  }

  .pull-right {
    float: right !important;
  }

  * {
    box-sizing: content-box !important;
  }

  .top-zindex {
    z-index: 9999 !important;
  }
</style>
