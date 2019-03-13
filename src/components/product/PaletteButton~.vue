<template>
  <div>
    <mt-palette-button content="+" @expanded="expanded"
                       @collapse="collapse"
                       direction="lt" class="pb" :radius="180"
                       mainButtonStyle="color:#fff;background-color:#F85759;"
                       style="left:30px;">
      <div></div>

      <div v-show="show" class="create">
        <span  @touchstart="createFullText()">创建文字</span><br>
        <span  @touchstart="createPic()">创建图片</span><br>
        <span  @touchstart="createVideo()">创建音频视频</span>
      </div>

    </mt-palette-button>
  </div>
</template>

<script>
  import router from "../../router/router";

  export default {
    data () {
      return {
        show: false
      }
    },
    methods: {
      expanded: function () {
        this.show = true
        console.log(this.show)
      },

      collapse: function () {
        this.show = false
        console.log(this.show)
      },
      createFullText: function () {
        router.push('/resourceMobile/newtext');
        console.log('create fulltext')
      },
      createPic: function () {
        router.push('/resourceMobile/newimg');
        console.log('create pictures')
      },
      createVideo: function () {
        router.push('/resourceMobile/newvideo');
        console.log('create videos')
      }
    }
  }
</script>

<style>
  .create {
    background-color: #ffffff;
    border:1px solid #dedede;
    height: 180px;
    width: 150px;
  }
</style>
