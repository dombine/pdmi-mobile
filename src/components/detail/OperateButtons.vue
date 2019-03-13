<template>
  <div class="footer-btns">
    <div class="btns-buttons btn-detail">
      <row-buttons :key="'1'" :options="createRowButtonOptions()"></row-buttons>
    </div>
    <div class="hidden">
      <div v-show="false" v-for="attributes in item.extendAttributes" v-if="attributes.id == '产品状态'" :key="attributes.id">
        {{getStatus(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" v-if="attributes.id == '机构ID'" :key="attributes.id">
        {{getOrganizationId(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" v-if="attributes.id == '签发资源ID'" :key="attributes.id">
        {{getAssignId(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" v-if="attributes.id == '审核人ID'" :key="attributes.id">
        {{getAuditorId(attributes.value)}}
      </div>
    </div>
    <mt-tabbar fixed class="btns-tabbar">
      <mt-tab-item id="1" :class="[isCollect?'is-selected':'']">
        <img v-if="!isCollect" slot="icon" src="../../assets/image/icon/收藏.svg" @click="collectOperator()">
        <img v-else slot="icon" src="../../assets/image/icon/已收藏.svg" @click="collectOperator()"> {{isCollect?'取消收藏':'收藏'}}
      </mt-tab-item>
      <!-- <mt-tab-item id="2">
            <img slot="icon" src="../../assets/image/icon/附件.svg" @click="loadAttachment()">
            附件
          </mt-tab-item>-->
      <mt-tab-item id="3">
        <img slot="icon" src="../../assets/image/icon/编目.svg" @click="loadCatalog()">编目
      </mt-tab-item>
      <mt-tab-item id="4">
        <img slot="icon" src="../../assets/image/icon/记录.svg" @click="loadNode()">记录
      </mt-tab-item>
      <mt-tab-item id="5" class="more-operator">
        <img style="margin-top: 12px" slot="icon" src="../../assets/image/icon/更多操作.svg" @click="loadButtons()">
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import rowButtons from '../product/buttonOperation/rowButtons.vue'
import { MessageBox, Toast } from 'mint-ui';
import util from '../../utils/utils'

let Utils = util();
export default {
  components: {
    rowButtons
  },
  mounted() {
    let that = this;
    this.loadItem(this.resourceId);
    //点击面板之外关闭面板
    $jq(document).bind('click', function(e) {
      var e = e || window.event; //浏览器兼容性
      var elem = e.target || e.srcElement;
      while (elem) { //循环判断至跟节点，防止点击的是div子元素
        if ($jq(elem).hasClass('line-cell-bottom') || $jq(elem).hasClass('more-operator')) { //当有这些class时，不关闭
          return;
        }
        elem = elem.parentNode;
      }
      $jq('.btn-detail .button-vertical').hide();
    });
  },
  data() {
    return {
      item: {},
      buttonList: null,
      organizationId: '',
      status: '',
      assignId: '',
      auditorId: '',
      styleObject: {},
      isCollect: false
    }
  },
  props: ['resourceId'],
  methods: {
    createRowButtonOptions: function() {
      return {
        item: this.item,
        buttonList: this.buttonList,
        organizationId: this.organizationId,
        status: this.status,
        assignId: this.assignId,
        auditorId: this.auditorId,
        styleObject: this.styleObject,
        type: '1'
      }
    },
    //刷新一条数据，去后台加载最新的数据替换掉list中的数据
    loadItem: function(resourceId) {
      let param = {};
      param.url = this.$global.getUrlByAppId("RESOURCEMANAGER") + "/basicsearch";
      let conditions = [];
      conditions.push({ id: "id", value: resourceId });
      param.conditions = conditions;
      param.start = 0;
      param.limit = 1;
      //        param.extendResultFields = "作者,机构ID,机构名称,产品状态,创作时间,签发资源ID,审核人ID";
      param.extendResultFields = "作者,创作时间,机构名称,产品状态,关键词,机构ID,签发资源ID,审核人ID,来源";
      let vm = this;
      let userId = vm.$global.userId;
      vm.$http.post(param.url,
        qs.stringify({ para: JSON.stringify(param), userId: userId }))
        .then(function(res) {
          vm.item = res.data.items[0];
          vm.isCollect = vm.item.collectorIds ? vm.item.collectorIds.indexOf(userId) > -1 : false;
          vm.$emit('load-item', vm.item);
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },
    loadNode: function() {
      this.$parent.$refs.popups.recordVisible = true;
    },
    loadCatalog: function() {
      this.$parent.$refs.popups.catalogVisible = true;
    },
    loadAttachment: function() {
      this.$parent.$refs.popups.attachmentsVisible = true;
    },
    collectOperator: function() {
      this.resourceCollect(this.isCollect);
    },
    resourceCollect: function(bol) {
      let vm = this;
      var simpleObjectItems = [];
      var simpleObjectItem = {};
      simpleObjectItem.id = vm.item.id;
      simpleObjectItem.inPoint = 0;
      simpleObjectItem.outPoint = 0;
      simpleObjectItems.push(simpleObjectItem);
      let url = vm.$global.getUrlByAppId('RESOURCEMANAGER') + '/collectResource';
      if (bol) {
        url = vm.$global.getUrlByAppId('RESOURCEMANAGER') + '/uncollectResource';
      }
      let userId = vm.$global.userId;
      let param = { objects: JSON.stringify(simpleObjectItems), owner: userId, sourceApp: "resourcemanager", userId: userId };
      vm.$http.post(url,
        qs.stringify(param))
        .then(function(res) {
          if (res.data.success) {
            vm.isCollect = !bol;
            Toast(bol ? '取消收藏成功' : '收藏成功');
            window.localStorage.setItem("detail-operator", true);
          } else {
            Toast(res.data.description);
          }
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },
    loadButtons: function() {
      if (!this.buttonList) {
        let vm = this;
        let userId = vm.$global.userId;
        let url = vm.$global.getUrlByAppId("CRE") + "/api/authorization/privilege/loadbuttons";
        vm.$http.put(url, JSON.stringify({
          "userId": userId,
          "organizationId": vm.organizationId,
          'status': vm.status,
          'creatorId': vm.item.creatorId,
          'auditorId': vm.auditorId
        }))
          .then(function(res) {
            vm.buttonList = res.data.privileges || [];
            vm.buttonList = Utils.sortPrivilegeButtons(vm.buttonList);
            vm.buttonVisable();
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      } else {
        this.buttonVisable();
      }
    },

    //点击时处理按钮部分的显隐
    buttonVisable: function() {
      let visable = $jq('.btn-detail .button-vertical.btn-' + this.item.id).css('display');
      if (visable === 'none') {
        $jq('.btn-detail .button-vertical').hide();
        let that = this;
        setTimeout(function() {
          $jq('.btn-detail .button-vertical.btn-' + that.item.id).show();
        }, 100);
      } else {
        $jq('.btn-detail .button-vertical').hide();
      }
    },
    //获取状态
    getStatus: function(value) {
      this.status = value;
      return value;
    },
    //获取机构id
    getOrganizationId: function(value) {
      this.organizationId = value;
      return value;
    },
    //获取签发id，判断资源是否已经被签发
    getAssignId: function(value) {
      this.assignId = value;
      return value;
    },
    getAuditorId: function(value) {
      this.auditorId = value;
      return value;
    }
  }
}
</script>

<style lang="scss">
.footer-btns {
  .btns-buttons {
    position: fixed;
    width: 150px;
    height: auto;
    right: 0px;
    bottom: 54px;
    z-index: 1;
  }
  .btns-tabbar {
    border-top: 1px solid #dedede;
  }
  .mint-tab-item {
    padding: 6px 0px;
  }
  .mint-tabbar>.mint-tab-item.is-selected {
    background-color: #FAFAFA;
    color: #ef4f4f;
  }
}
</style>
