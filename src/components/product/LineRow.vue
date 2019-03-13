<template>
  <div class="line-cell">
    <div class="line-cell-top">
      <img class="pull-left line-cell-icon" :src="iconUrl" @error="iconUrlDefault">
      <img class="status-icon" :src="statusIcon()" alt="">
      <div class="pull-right line-cell-opera" @click="toggleButtons">
        <img class="row-menu" src="../../assets/image/menu.png" alt="">
      </div>
      <div class="line-cell-title" :class="{ browsed: item.browse }" @click="gotoDetail(item)">
        <span>{{item.originalName}}</span>
      </div>
    </div>
    <div class="line-cell-mid">
      <div class="inline-block element-time">{{dateFormat(item.created)}}</div>
      <div class="inline-block element-name">{{item.creatorName}}</div>
      <div v-for="attributes in item.extendAttributes" v-if="attributes.id == '机构名称'" :key="attributes.id" class="inline-block element-dept">
        {{getLeafOrgName(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" :key="attributes.id" v-if="attributes.id == '产品状态'">
        {{getStatus(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" :key="attributes.id" v-if="attributes.id == '机构ID'">
        {{getOrganizationId(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" :key="attributes.id" v-if="attributes.id == '签发资源ID'">
        {{getAssignId(attributes.value)}}
      </div>
      <div v-show="false" v-for="attributes in item.extendAttributes" :key="attributes.id" v-if="attributes.id == '审核人ID'">
        {{getAuditorId(attributes.value)}}
      </div>
    </div>
    <div class="btn-list">
      <row-buttons :options="createRowButtonOptions()" @on-delete-row="deleteRow"></row-buttons>
    </div>
  </div>
</template>
<script>
import { MessageBox, Toast } from 'mint-ui';
import rowButtons from './buttonOperation/rowButtons.vue'
import $ from 'jquery'
import util from '../../utils/utils.js'

let Utils = util();

export default {
  components: {
    MessageBox, Toast, rowButtons
  },
  data() {
    return {
      buttonList: null,
      organizationId: '',
      status: '',
      assignId: '',
      auditorId: '',
      iconUrl : this.item.iconUrl
    }
  },
  props: ['item', 'index', 'options'],
  watch: {
    item: function(val) {
      this.buttonList = null;
    }
  },
  mounted() {

  },
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
        type: '0'
      }
    },
    gotoDetail: function(item) {
      Utils.gotoDetail(item);
    },

    iconUrlDefault : function(){
      let urlarray = this.item.iconUrl.split('/');
      let url_prev = urlarray[0] + "//" + urlarray[2] + "/" + urlarray[3] + "/";
      this.iconUrl = url_prev + this.item.ccid + ".svg";
    },

    statusIcon : function(){
      let urlarray = this.item.iconUrl.split('/');
      let url_prev = urlarray[0] + "//" + urlarray[2] + "/" + urlarray[3] + "/";
      return url_prev + this.status +".svg";
    },

    //加载有权限的按钮，只有第一次在数据库中加载
    toggleButtons: function() {
      let vm = this;
      let userId = vm.$global.userId;
      let url = vm.$global.getUrlByAppId("CRE") + "/api/authorization/privilege/loadbuttons";
      if (!this.buttonList) {
        vm.$http.put(url, JSON.stringify({
          "userId": userId,
          "organizationId": vm.organizationId,
          'status': vm.status,
          'creatorId': vm.item.creatorId,
          'auditorId': vm.auditorId
        }))
          .then(function(res) {
            if(vm.options === '4'){ //列表页我的收藏特殊处理
              vm.buttonList = [];
              let results = res.data.privileges || [];
              let _share = vm.$global.arrayFind(results,"privilegeId","PID_PRODUCT_STATUS_SHARE");
              if(_share)
                vm.buttonList.push(_share);
              vm.buttonList.push({privilegeId : 'PID_PRODUCT_UNCOLLECT',aliasName : '取消收藏'});
            }else{
              vm.buttonList = res.data.privileges || [];
              vm.buttonList = Utils.sortPrivilegeButtons(vm.buttonList);
              vm.buttonList.push({privilegeId : 'PID_PRODUCT_COLLECT',aliasName : '收藏'});
            }
            vm.buttonVisable();
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      } else {
        vm.buttonVisable();
      }
    },
    //点击时处理按钮部分的显隐
    buttonVisable: function() {
      var visable = $jq('.btn-list .button-horizontal.btn-' + this.item.id).css('display');
      if (visable === 'none') {
        $jq('.btn-list .button-horizontal').hide();
        let that = this;
        setTimeout(function() {
          $jq('.btn-list .button-horizontal.btn-' + that.item.id).show();
        }, 100)
      } else {
        $jq('.btn-list .button-horizontal').hide();
      }
    },
    //日期格式化
    dateFormat: function(value) {
      return this.$global.dateFormat(new Date(value), "MM-dd hh:mm");
    },
    //获取部门名称
    getLeafOrgName: function(orgName) {
      var index = orgName.lastIndexOf('-');
      if (index > 0) {
        return orgName.substring(index + 1);
      } else {
        return orgName;
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
    },
    //页面提示的方法
    messageAlert: function(message) {
      Toast({ message: message });
    },
    deleteRow: function(item) {
      this.$emit('on-delete-row', item);
    }
  }
}
</script>
<style lang="scss">
.line-cell {
  .browsed {
    color: #888888 !important;
  }
  .line-cell-top {
    padding: 5px 0px 5px 10px;
    position: relative;
    div.line-cell-title {
      font-size: 15px;
      color: #000;
      min-height: 40px;
      margin-left: 40px;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      padding-top: 5px;
      margin-right: 40px;
    }
    .line-cell-icon {
      width: 30px;
      height: 30px;
      margin-top: 3px;
    }
    .status-icon{
      position: absolute;
      width: 12px;
      height: 12px;
      left: 28px;
      top: 25px;
    }
    .line-cell-opera{
      width:40px;
      text-align: right;
      margin-top:15px;
      .row-menu {
        width: 32px;
        height: 32px;
        border-radius: 5px;
      }
    }
  }
  .line-cell-mid {
    font-size: 14px;
    margin: 5px 0px 5px 50px;
    div {
      color: #888888;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .element-time {
      width: 30%;
      text-align: left;
      vertical-align: middle;
    }
    .element-name {
      width: 20%;
      text-align: center;
      vertical-align: middle;
    }
    .element-dept {
      width: 45%;
      text-align: center;
      vertical-align: middle;
    }
  }
}
</style>
