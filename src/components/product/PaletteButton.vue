<template>
  <div class="popup-add">
    <div class="popupimg" @click="toggle">
      <img src="../../assets/image/icon/加号白色.svg" alt="">
    </div>
    <div class="popuptext" :class="[show?'show':'']">
      <div @click="createFullText()">
        <i class="icon text-red"></i>&nbsp;&nbsp;创建文字</div>
      <div @click="createPic()">
        <i class="icon picture-red"></i>&nbsp;&nbsp;创建图片</div>
      <div @click="createVideo()">
        <i class="icon video-red"></i>&nbsp;&nbsp;创建音频视频</div>
    </div>
  </div>
</template>

<script>
import router from "../../router/router";

export default {
  data() {
    return {
      show: false
    }
  },
  mounted() {
    let that = this;
    $jq(document).bind('click', function(e) {
      var e = e || window.event; //浏览器兼容性
      var elem = e.target || e.srcElement;
      while (elem) { //循环判断至跟节点，防止点击的是div子元素
        if ($jq(elem).hasClass('popupimg')) { //当有这些class时，不关闭
          return;
        }
        elem = elem.parentNode;
      }
      that.show = false;
    });
  },
  methods: {
    toggle: function() {
      this.show = !this.show;
    },
    createFullText: function() {
      router.push('/resourceMobile/newtext');
      console.log('create fulltext')
    },
    createPic: function() {
      router.push('/resourceMobile/newimg');
      console.log('create pictures')
    },
    createVideo: function() {
      router.push('/resourceMobile/newvideo');
      console.log('create videos')
    }
  }
}
</script>

<style lang="scss">
.popup-add {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;

  position: relative;
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .popupimg {
    border-radius: 500px;
    background-color: #ef4f4f;
    img {
      width: 54px;
      height: 50px;
    }
  }
  .popuptext {
    visibility: hidden;
    width: 150px;
    border: 1px solid #ef4f4f;
    background-color: #fff;
    color: #000;
    text-align: left;
    border-radius: 5px;
    position: absolute;
    z-index: 1;
    bottom: 55px;
    left: 50%;
    --margin-left: -80px;
    div {
      height: 30px;
      line-height: 30px;
      padding: 10px;
    }
  }
  .popuptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 5%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #ef4f4f transparent transparent transparent;
  }
  .show {
    visibility: visible;
    -webkit-animation: fadeIn 1s;
    animation: fadeIn 1s;
  }
  @-webkit-keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
