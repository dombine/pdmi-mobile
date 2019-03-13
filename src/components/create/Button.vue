<template>
  <div class="footBtns">
    <div class="lr">
      <mt-button  @click="catalogue" size="small"  type="danger" style="width:80px;height:34px;">
        编目
      </mt-button>
    </div>
    <div class="center">
      <mt-button  @click="save" size="small"  type="danger" style="width:80px;">
        <img class="saveBtn" slot="icon"></img>保存草稿
      </mt-button>
    </div>

    <div class="lr">
      <mt-button  @click="commit" size="small"  type="danger" style="width:80px;"><img class="commitBtn" slot="icon">提交审核
      </mt-button>
    </div>

  </div>
</template>

<script>
  export default {

    props: {
      catalogue: {
        default: function () {
          console.log('catalogue')
        }
      },
      save: {
        default: function () {
          console.log('save')
        }
      },
      commit: {
        default: function () {
          console.log('commit')
        }
      }
    }
  }
</script>

<style lang="scss">

  .footBtns {
    .lr{
      float: left;
      width: 33%;
      text-align:center;
    }

    .center {
      float: left;
      width: 34%;
      text-align:center;
    }

    .saveBtn {
      height:20px;
      width: 20px;
      background-image: url(../../assets/image/icon/mini保存.svg);
    }
    .commitBtn {
      height:20px;
      width: 20px;
      background-image: url(../../assets/image/icon/mini提交.svg);
    }
  }


</style>
