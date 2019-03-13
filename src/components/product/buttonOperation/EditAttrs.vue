<template lang="html">
  <div class="editAttr">
    <common-header :options="headerOptions"></common-header>

      <div class="set-container">
          <div class="set-body">
                <!--<img class="img-left" src="../../../assets/image/icon/多人.svg" alt="">-->
                <span class="img-left" >标题</span>
                <div>
                  <input type="text" name="" value="" placeholder="标题" v-model="title">
                </div>
          </div>
          <div class="set-body">
               <span class="img-left" >作者</span>
                <div>
                  <input type="text" name="" value="" placeholder="作者" v-model="author">
                </div>
          </div>
          <div class="set-body">
                <span class="img-left" >来源</span>
                <div>
                  <input type="text" name="" value="" placeholder="来源" v-model="comefrom">
                </div>
              </div>
          <div class="set-body">
                <span class="img-left" >关键字</span>
                <div class="last">
                  <input type="text" name="" value="" placeholder="关键字" v-model="keyword">
                </div>
              </div>
              <div class="bottom-button">

      <mt-button  class="footBtn" @click="saveAttrs" type="danger" size="small">
        <img src="../../../assets/image/icon/mini保存.svg" height="20px" width="20px" slot="icon">
        保存修改</mt-button>
    </div>
      </div>
  </div>


</template>

<script>

import CommonHeader from '../../common/CommonHeader.vue'
import { Toast } from 'mint-ui'
export default {
  components: {
    CommonHeader, Toast
  },
  data() {
    return {
      resourceId: this.$route.params.resourceID,
      headerOptions: { title: '编目属性', align: 'center' },
      title: '',
      author: '',
      comefrom: '',
      keyword: '',
      ccid: '',
      item: {}
    }
  },
  mounted: function() {
    this.loadAttrs();
  },

  methods: {
    loadAttrs: function() {
      let that = this
      var url = this.$global.getUrlByAppId("PORTAL") + "/loadDetailInfo/" + this.resourceId;
      this.$http.get(url)
        .then(function(response) {
          console.log(response)
          that.title = response.data.resou.name;
          that.author = response.data.author;
          that.comefrom = response.data.comefrom;
          that.keyword = response.data.keyword;
          that.ccid = response.data.resou.ccid;
        })
        .catch(function(error) {
          Toast("获取失败");
        })
    },

    saveAttrs: function() {
      var that = this;
      var url = this.$global.getUrlByAppId("PORTAL")
        + "/alterResource?resourceId=" + this.resourceId + "&author="
        + this.author + "&comefrom=" + this.comefrom + "&keywords=" + this.keyword;

      this.$http.get(url)
        .then(function(response) {
          console.log(response)
          if (response.status == 200) {
            that.updateTitle()
          } else {
            Toast("修改失败");
          }
        })
        .catch(function(error) {
          Toast("修改失败");
        })
    },

    updateTitle: function() {
      let that = this;
      let url = this.$global.getUrlByAppId("RESOURCEMANAGER") + "/renameResource";
      var simpleObjectItems = [];
      var simpleObjectItem = {};
      simpleObjectItem.id = this.resourceId;
      simpleObjectItem.inPoint = 0;
      simpleObjectItem.outPoint = 0;
      simpleObjectItem.name = this.title;
      simpleObjectItems.push(simpleObjectItem);
      var para = qs.stringify({
        objects: JSON.stringify(simpleObjectItems),
        resourceId: this.resourceId
      });
      this.$http.post(url, para)
        .then(function(res) {
          if (res.data.success === true) {
            Toast("修改成功");
            window.localStorage.setItem("detail-operator", true);
            if (that.ccid == '图片产品')
              router.push('/resourceMobile/imageDetail/' + that.resourceId + '/detail');
            else if (that.ccid == '视频产品' || that.ccid == '音频产品')
              router.push('/resourceMobile/videoDetail/' + that.resourceId + '/detail');
            else if (that.ccid == '富文本类')
              router.push('/resourceMobile//' + that.resourceId + '/detail');
          } else {
            Toast("修改失败")
          }
        })
        .catch(function() {
          Toast("修改失败")
        })
    }
  }
}
</script>


<style lang="scss">
.editAttr {
  .set-title {
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    padding: 5px 5px 5px 20px;
    background-color: #F6F6F6;
  }
  .set-container {
    .last {
      border-bottom: 0px !important;
    }
    .set-body {
      div {
        font-size: 15px;
        height: 30px;
        line-height: 30px;
        padding: 5px;
        border-bottom: 1px solid #dedede;
        margin-left: 30px;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        &:empty:before {
          content: attr(placeholder);
          color: #888;
        }
        input {
          width: 100%;
          height: 100%;
          border: 0px;
          outline: none;
          font-size: 15px;
        }
      }
      .img-left {
        float: left;
        width: 80px;
        height: 20px;
        margin-top: 10px;
        margin-left: auto;
        text-align: center;
        font-size: medium;
      }
    }
  }
  .footBtn {
    margin: 2% auto;
    display: block;
  }
  .bottom-button {
    width: 100%;
    background-color: #fff;
    margin: 0 auto;
    text-align: center;
    position: fixed;
    bottom: 2%;
  }
}
</style>
