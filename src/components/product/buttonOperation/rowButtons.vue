<template lang="html">
  <div class="line-cell-bottom" :class="[type=='1'?'button-vertical':'button-horizontal',createBtnId(item.id)]" style="display:none;" :style="styleObject" v-show="buttonList && buttonList.length">
    <mt-button v-for="button in buttonList" :key="button.privilegeId" :id="button.privilegeId"
               :type="button.color?'danger':'default'" size="small" @click="buttonMethod(button.privilegeId)">
               <i class="icon" :class="buttonIcon(button.privilegeId)"></i>
      {{button.aliasName}}
    </mt-button>
  </div>
</template>

<script>
import { MessageBox, Toast } from 'mint-ui';
export default {
  components: {
    MessageBox, Toast
  },
  data() {
    return {
      organizationId: this.options.organizationId,
      status: this.options.status,
      assignId: this.options.assignId,
      auditorId: this.options.auditorId,
      buttonList: this.options.buttonList,
      styleObject: this.options.styleObject,
      type: this.options.type,
      item: this.options.item,
      currentPage : this.$route.name
    }
  },
  props: ['options'],
  watch: {
    options: function(val) {
      this.organizationId = val.organizationId;
      this.status = val.status;
      this.assignId = val.assignId;
      this.auditorId = val.auditorId;
      this.buttonList = this.options.buttonList;
      this.styleObject = this.options.styleObject;
      this.type = this.options.type;
      this.item = this.options.item;
    }
  },
  methods: {
    buttonIcon: function(value) {
      return 'btn-' + this.$global.underline2Camel(value);
    },
    createBtnId: function(value) {
      return 'btn-' + value;
    },
    messageAlert: function(message) {
      Toast({ message: message });
    },
    //点击按钮的处理事件，统一调用对应的方法
    buttonMethod: function(privilegeId) {
      var methodName = this.$global.underline2Camel(privilegeId);
      if (this[methodName])
        this[methodName]();
    },
    //********************以下为按钮的操作方法***************************//
    //删除
    pidProductStatusDelete: function() {
      console.log(this.currentPage + '-----------------删除')
      let vm = this;
      let userId = vm.$global.userId;
      let url = vm.$global.getUrlByAppId("RESOURCEMANAGER") + "/removeResourceToRecyclebin?resourceId=" + vm.item.id + '&userId=' + userId;
      var simpleObjectItems = [];
      var simpleObjectItem = {};
      simpleObjectItem.id = vm.item.id;
      simpleObjectItem.inPoint = 0;
      simpleObjectItem.outPoint = 0;
      simpleObjectItems.push(simpleObjectItem);
      var param = qs.stringify({
        objects: JSON.stringify(simpleObjectItems),
        owner: userId,
        sourceApp: "resourcemanager"
      });
      MessageBox.confirm('确定删除数据吗?').then(action => {
        vm.$http.post(url, param)
          .then(function(res) {
            vm.messageAlert('执行成功');
            if (vm.currentPage === 'product')
              vm.$emit('on-delete-row', vm.item);//删除数据以后，触发product.vue中的 on-delete-row 事件，将数据移除
            else if (vm.currentPage.indexOf("Detail") > -1)
              router.push({ name: 'product', params: { 'refresh': true } });
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      }).catch(err => {

      });
    },
    //下载
    pidProductStatusDownload: function() {
      console.log(this.currentPage + '-----------------下载')
      var url = this.$global.getUrlByAppId("RESOURCEMANAGER") + '/resource/' + this.item.id + '/downloadfiles';
      window.open(url);
    },
    //草稿状态的提交审核
    pidProductCgAudit: function() {
      console.log(this.currentPage + '-----------------提交审核')
      //router.push({name : 'audit4draft',params : {id : this.item.id,name:'333',resource:{id:'222'}}});
      router.push('/resourceMobile/audit4draft/' + this.item.id);
    },
    //移动
    pidProductStatusMove: function() {
      console.log(this.currentPage + '-----------------移动')
      router.push('/resourceMobile/move/' + this.item.id + '/' + this.organizationId);
    },
    //签发
    pidProductStatusAssign: function() {
      console.log(this.currentPage + '-----------------签发')
      //判断是否已经选择资源,newspaper往哪个报社进行签发
      let that = this;
      if (this.assignId) {
        MessageBox.confirm('资源已经签发确认再次签发?').then(action => {
          router.push('/resourceMobile/issuer/' + that.item.id);
        }).catch(err => { });
      } else {
        router.push('/resourceMobile/issuer/' + that.item.id);
      }
    },
    //撤销签发
    pidProductStatusAssignRevoke: function() {
      console.log(this.currentPage + '-----------------撤销签发')
      let vm = this;
      let url = vm.$global.getUrlByAppId("RESOURCEMANAGER") + "/resources/revokeIssuer?userId=" + vm.$global.userId;
      if (vm.assignId) {
        vm.$http({
          url: url,
          data: JSON.stringify({ newspaper: 1, ccid: vm.item.ccid, id: vm.item.id, resourceId: vm.assignId }),
          method: 'delete',
          headers: { 'Content-Type': 'text/plain;utf-8' }
        })
          .then(function(res) {
            vm.messageAlert('执行成功');
            if (vm.currentPage === 'product')
              vm.$emit('on-delete-row', vm.item);
            else if (vm.currentPage.indexOf("Detail") > -1)
              router.go(0);
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      } else {
        vm.messageAlert('资源尚未签发无法撤销签发');
      }
    },
    //分享到移动助手
    pidProductStatusShare: function() {
      console.log(this.currentPage + '-----------------分享')
      let vm = this;
      let id = vm.item.id;
      let shareUrl = vm.$global.getUrlByAppId("RESOURCEMANAGER") + '/pdmi/resource/' + id + '/shareInfo/inteam';
      vm.$http.get(shareUrl)
        .then(function(res) {
          let data = res.data;
          window.open("https://inteam.hubpd.com/share?fileName=" + data.fileName +
            "&fileType=" + data.fileType +
            "&fileSize=" + data.fileSize +
            "&downloadUrl=" + data.downloadUrl +
            "&thumbnailUrl=" + data.thumbnailUrl, "blank");
        })
        .catch(function(error) {
          console.log(error.response.data)
          vm.messageAlert(error.response.data.info);
        });
    },
    //修改
    pidProductStatusUpdate: function() {
      console.log('pidProductStatusUpdate');
      //text only
      if (this.item.ccid === "富文本类") {
        router.push("/resourceMobile/edittext/" + this.item.id)
      } else {
        router.push("/resourceMobile/editAttrs/" + this.item.id)
      }

    },
    pidProductStatusAudit: function() {
      let vm = this
      let ccid = vm.item.ccid;
      let resourceId = vm.item.id;

      if (vm.currentPage === 'product') {
        //进入详情页
        if (ccid === '图片产品')
          router.push('/resourceMobile/imageDetail/' + resourceId + '/audit');
        else if (ccid === '富文本类')
          router.push('/resourceMobile/textDetail/' + resourceId + '/audit');
        else if (ccid === '视频产品' || ccid === '音频产品')
          router.push('/resourceMobile/videoDetail/' + resourceId + '/audit');
      } else if (vm.currentPage.indexOf("Detail") > -1) {
          //vm.$parent.$parent.$refs.popups.auditVisible = true;
        router.push('/resourceMobile/audit/' + resourceId);
      }
    },
    pidProductUncollect : function(){
      let vm = this;
      var simpleObjectItems = [];
      var simpleObjectItem = {};
      simpleObjectItem.id = vm.item.id;
      simpleObjectItem.inPoint = 0;
      simpleObjectItem.outPoint = 0;
      simpleObjectItems.push(simpleObjectItem);
      let url = vm.$global.getUrlByAppId('RESOURCEMANAGER') + '/uncollectResource';
      let userId = vm.$global.userId;
      let param = { objects: JSON.stringify(simpleObjectItems), owner: userId, sourceApp: "resourcemanager", userId: userId };
      vm.$http.post(url,
        qs.stringify(param))
        .then(function(res) {
          if (res.data.success) {
            Toast( '取消收藏成功');
            vm.$emit('on-delete-row', vm.item);
          } else {
            Toast(res.data.description);
          }
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },
    pidProductCollect : function(){
      let vm = this;
      var simpleObjectItems = [];
      var simpleObjectItem = {};
      simpleObjectItem.id = vm.item.id;
      simpleObjectItem.inPoint = 0;
      simpleObjectItem.outPoint = 0;
      simpleObjectItems.push(simpleObjectItem);
      let url = vm.$global.getUrlByAppId('RESOURCEMANAGER') + '/collectResource';
      let userId = vm.$global.userId;
      let param = { objects: JSON.stringify(simpleObjectItems), owner: userId, sourceApp: "resourcemanager", userId: userId };
      vm.$http.post(url,
        qs.stringify(param))
        .then(function(res) {
          if (res.data.success) {
            Toast( '收藏成功');
            //$jq('.btn-list .button-horizontal.btn-' + vm.item.id).hide();
          } else {
            Toast(res.data.description);
          }
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.line-cell-bottom {
  background-color: #FFF0F0;
  padding: 3px;
  text-align: center;
  max-height: 400px;
  overflow: auto;
  i.icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-top: -3px;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
}

.button-horizontal {
  i.icon {
    display: block;
    margin: auto;
    background-size: 16px 16px;
  }
  .mint-button {
    margin: 3px;
  }
  .mint-button--small {
    font-size: 12px;
    padding: 0px 12px;
    background-color: #FFF0F0;
    box-shadow: 0 0 0px;
    height: 41px;
  }
}

.button-vertical {
  i.icon {
    background-size: 16px 16px;
  }
  .mint-button {
    margin: 3px;
  }
  .mint-button--small {
    display: block;
    padding: 0px 12px;
    background-color: #FFF0F0;
    box-shadow: 0 0 0px;
    height: 41px;
  }
}
</style>
