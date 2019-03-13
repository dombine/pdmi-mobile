<template>
  <div v-show="visable" class="query-tab" id="query-tab">
    <div class="top-fixed" :class="[topZindex?'top-zindex':'']">
      <div class="inline-block query-tab-tab">
        <mt-navbar v-model="selected">
          <mt-tab-item id="1">全部</mt-tab-item>
          <mt-tab-item id="2">签审</mt-tab-item>
          <mt-tab-item id="3">草稿</mt-tab-item>
          <mt-tab-item id="4">收藏</mt-tab-item>
        </mt-navbar>
      </div>
      <!-- <div class="inline-block query-tab-query">
            <img src="../../assets/image/query.png" alt="" @click="showQuery()">
          </div> -->
      <div v-show="selected == '1'" class="query-tab-bottom">
        <div class="inline-block query-tab-bottom-org" :class="[organizationPopupVisible?'search-active':'']">
          <span @click="showOrganization()" :class="[hasQuery(tabOptions.tab1.organization.name)?'has-query':'']">{{solveOrgName(tabOptions.tab1.organization.name)}}</span>
          <img v-show="hasQuery(tabOptions.tab1.organization.name)" src="../../assets/image/close.png" alt="" @click="clearOrganization">
        </div><div class="inline-block query-tab-bottom-status" :class="[statusPopupVisible?'search-active':'']">
          <span @click="showStatus()">{{tabOptions.tab1.status.name}}</span>
        </div><div class="inline-block query-tab-bottom-time" :class="[timePopupVisible?'search-active':'']">
          <span @click="showTime()" :class="[hasQuery(tabOptions.tab1.time.name)?'has-query':'']">{{tabOptions.tab1.time.name}}</span>
          <img v-show="hasQuery(tabOptions.tab1.time.name)" src="../../assets/image/close.png" alt="" @click="clearTime">
        </div>
      </div>
      <div v-show="selected == '2'" class="query-tab-bottom">
        <div class="inline-block query-tab-bottom-org" :class="[organizationPopupVisible?'search-active':'']">
          <span @click="showOrganization()" :class="[hasQuery(tabOptions.tab2.organization.name)?'has-query':'']">{{solveOrgName(tabOptions.tab2.organization.name)}}</span>
          <img v-show="hasQuery(tabOptions.tab2.organization.name)" src="../../assets/image/close.png" alt="" @click="clearOrganization">
        </div><div class="inline-block query-tab-bottom-status" :class="[statusPopupVisible?'search-active':'']">
          <span @click="showStatus()">{{tabOptions.tab2.status.name}}</span>
        </div><div class="inline-block query-tab-bottom-time" :class="[timePopupVisible?'search-active':'']">
          <span @click="showTime()" :class="[hasQuery(tabOptions.tab2.time.name)?'has-query':'']">{{tabOptions.tab2.time.name}}</span>
          <img v-show="hasQuery(tabOptions.tab2.time.name)" src="../../assets/image/close.png" alt="" @click="clearTime">
        </div>
      </div>
      <div v-show="selected == '3'" class="query-tab-bottom cg-query">
        <div class="inline-block query-tab-bottom-org">
          <span>&nbsp;</span>
        </div><div class="inline-block query-tab-bottom-status">
          <span>&nbsp;</span>
        </div><div class="inline-block query-tab-bottom-time" :class="[timePopupVisible?'search-active':'']">
          <span @click="showTime()" :class="[hasQuery(tabOptions.tab3.time.name)?'has-query':'']">{{tabOptions.tab3.time.name}}</span>
          <img v-show="hasQuery(tabOptions.tab3.time.name)" src="../../assets/image/close.png" alt="" @click="clearTime">
        </div>
      </div>
      <div v-show="selected == '4'" class="query-tab-bottom">
        <div class="inline-block query-tab-bottom-org" :class="[organizationPopupVisible?'search-active':'']">
          <span @click="showOrganization()" :class="[hasQuery(tabOptions.tab4.organization.name)?'has-query':'']">{{solveOrgName(tabOptions.tab4.organization.name)}}</span>
          <img v-show="hasQuery(tabOptions.tab4.organization.name)" src="../../assets/image/close.png" alt="" @click="clearOrganization">
        </div><div class="inline-block query-tab-bottom-status" :class="[statusPopupVisible?'search-active':'']">
          <span @click="showStatus()">{{tabOptions.tab4.status.name}}</span>
        </div><div class="inline-block query-tab-bottom-time" :class="[timePopupVisible?'search-active':'']">
          <span @click="showTime()" :class="[hasQuery(tabOptions.tab4.time.name)?'has-query':'']">{{tabOptions.tab4.time.name}}</span>
          <img v-show="hasQuery(tabOptions.tab4.time.name)" src="../../assets/image/close.png" alt="" @click="clearTime">
        </div>
      </div>
    </div>
    <!--状态检索-->
    <mt-popup class="query-popup heightauto" v-model="statusPopupVisible" :modal="modal" :closeOnClickModal="closeOnClickModal" position="top">
      <status-search :opts="statusOptions()"></status-search>
    </mt-popup>

    <!--时间检索-->
    <mt-popup class="query-popup heightauto" v-model="timePopupVisible" :modal="modal" :closeOnClickModal="closeOnClickModal" position="top">
      <!--使用多个，否则会造成相互干扰 -->
      <time-search :opts="timeOptions()"></time-search>
    </mt-popup>

    <!--组织机构检索-->
    <mt-popup class="query-popup heightauto" v-model="organizationPopupVisible" :modal="modal" :closeOnClickModal="closeOnClickModal" position="top">
      <organization :options="organizationOptions()"></organization>
    </mt-popup>
  </div>
</template>
<script>

import StatusSearch from './StatusSearch.vue'
import Search from '../common/Search.vue'
import TimeSearch from './TimeSearch.vue'
import Organization from './Organization.vue'
export default {
  name: 'ProductQuery',
  components: {
    StatusSearch, Search, TimeSearch, Organization
  },
  data() {
    return {
      tData: [],
      selected: this.options,
      statusPopupVisible: false,
      timePopupVisible: false,
      organizationPopupVisible: false,
      closeOnClickModal: true,
      topZindex : true,
      modal: true,
      tabOptions: {
        tab1: {
          organization: { id: '', name: "全部组织" },
          status: { id: '待审核', name: '待审核' },
          time: { id: '', name: '全部时间' }
        },
        tab2: {
          organization: { id: '', name: "全部组织" },
          status: { id: '待审核', name: '待我审核' },
          time: { id: '', name: '全部时间' }
        },
        tab3: {
          organization: { id: '', name: "全部组织" },
          status: { id: '草稿', name: '草稿' },
          time: { id: '', name: '全部时间' }
        },
        tab4: {
          organization: { id: '', name: "全部组织" },
          status: { id: '待审核', name: '待我审核' },
          time: { id: '', name: '全部时间' }
        }
      }
    }
  },
  props: ['options', 'visable'],
  watch: {
    selected: function(val) {
      this.organizationPopupVisible = false;
      this.timePopupVisible = false;
      this.statusPopupVisible = false;
      this.$emit('product-query-change', val, this.tabOptions['tab' + this.selected]);
    },
    organizationPopupVisible: function(val) {
      this.bodyScroll(!val && !this.timePopupVisible && !this.statusPopupVisible);
    },
    timePopupVisible: function(val) {
      this.bodyScroll(!val && !this.organizationPopupVisible && !this.statusPopupVisible);
    },
    statusPopupVisible: function(val) {
      this.bodyScroll(!val && !this.timePopupVisible && !this.organizationPopupVisible);
    }
  },
  mounted() {
    let vm = this;
    let userId = vm.$global.userId;
    let url = vm.$global.getUrlByAppId("CRE") + "/api/authorization/organization/load/mainclass";
    vm.$http.put(url, JSON.stringify({
      "userId": userId,
      "privilegePrefix": "PID_PRODUCT_FLODER_BROWSER"
    }))
      .then(function(res) {
        vm.tData = res.data.organizationList;
      })
      .catch(function(error) {
        console.log(error.response.data);
      })
  },
  methods: {
    bodyScroll: function(flag) {
      let that = this;
      if (flag) {
        $jq('body,html').css('overflow', 'auto').css('height', 'auto');
        window.setTimeout(function(){
          //$jq('#query-tab .top-fixed').removeClass('top-zindex');
          that.topZindex = false;
        },200);
      } else {
        //$jq('#query-tab .top-fixed').addClass('top-zindex');
        $jq('body,html').css('overflow', 'hidden').css('height', '100%');
        that.topZindex = true;
      }
    },
    solveOrgName: function(name) {
      let num = Math.ceil(document.body.clientWidth / 80);
      if (name.length > num) {
        return name.substr(0, num) + '...';
      } else {
        return name;
      }
    },
    organizationOptions: function() {
      let that = this;
      return {
        treeData: this.tData,
        format: true,
        hasButton: true,
        selected: this.tabOptions['tab' + this.selected].organization.id,
        selectedName: this.tabOptions['tab' + this.selected].organization.name,
        callBack: function(selectedNode) {
          if (selectedNode && selectedNode.id) {
            that.tabOptions['tab' + that.selected].organization.name = selectedNode.text;
            that.tabOptions['tab' + that.selected].organization.id = selectedNode.id;
          } else {
            that.tabOptions['tab' + that.selected].organization.name = '全部组织';
            that.tabOptions['tab' + that.selected].organization.id = '';
          }
          that.organizationPopupVisible = false;
          that.$parent.organizationId = selectedNode.id;
          that.$parent.refresh();
        },
        backMethod: this.hideOrganization
      }
    },
    timeOptions: function() {
      let that = this;
      return {
        selected: this.tabOptions['tab' + this.selected].time.id ? this.tabOptions['tab' + this.selected].time.id.split(',') : [],
        callBack: function(begin, end) {
          if (!begin || !end) {
            that.tabOptions['tab' + that.selected].time.name = '全部时间';
            that.tabOptions['tab' + that.selected].time.id = '';
          } else {
            let index = begin.indexOf('-');
            that.tabOptions['tab' + that.selected].time.name = begin.substr(index + 1) + '~' + end.substr(index + 1);
            that.tabOptions['tab' + that.selected].time.id = begin + ',' + end;
          }
          that.timePopupVisible = false;
          that.$parent.beginTime = begin;
          that.$parent.endTime = end;
          that.$parent.refresh();
        },
        backMethod: this.hideTime
      }
    },
    statusOptions: function() {
      let that = this;
      return {
        data: (this.selected == '1' || this.selected == '4') ? [
          { id: '待审核', name: '待审核' },
          { id: '审核通过', name: '审核通过' },
          { id: '被驳回', name: '被驳回' },
          { id: '已签发', name: '已签发' }
        ] : this.selected == '2' ? [
          { id: '待审核', name: '待我审核' },
          { id: '已转审', name: '我已转审' },
          { id: '被驳回', name: '我已驳回' },
          { id: '审核通过', name: '我已通过' }
        ] : [
              { id: '草稿', name: '草稿' }
            ],
        selected: this.tabOptions['tab' + this.selected].status.id,
        callBack: function(selectedNode) {
          that.statusPopupVisible = false;
          that.tabOptions['tab' + that.selected].status.id = selectedNode.id;
          that.tabOptions['tab' + that.selected].status.name = selectedNode.name;
          that.$parent.statusName = selectedNode.id;
          that.$parent.refresh();
        },
        backMethod: this.hideStatus
      };
    },
    showQuery: function() {
      router.push('/resourceMobile/search');
    },
    showTime: function() {
      this.timePopupVisible = !this.timePopupVisible;
      this.organizationPopupVisible = false;
      this.statusPopupVisible = false;
    },
    hideTime: function() {
      this.timePopupVisible = false;
    },
    showStatus: function() {
      this.statusPopupVisible = !this.statusPopupVisible;
      this.timePopupVisible = false;
      this.organizationPopupVisible = false;
    },
    hideStatus: function() {
      this.statusPopupVisible = false;
    },
    showOrganization: function() {
      this.organizationPopupVisible = !this.organizationPopupVisible;
      this.timePopupVisible = false;
      this.statusPopupVisible = false;
    },
    hideOrganization: function() {
      this.organizationPopupVisible = false;
    },
    hasQuery: function(value) {
      return !(value.indexOf('全部') > -1);
    },
    clearOrganization: function() {
      var that = this;
      that.tabOptions['tab' + that.selected].organization.name = '全部组织';
      that.tabOptions['tab' + that.selected].organization.id = '';
      that.$parent.organizationId = '';
      that.$parent.refresh();
    },
    clearStatus: function() {
      let that = this;
      that.tabOptions['tab' + that.selected].status.id = '';
      that.tabOptions['tab' + that.selected].status.name = '全部状态';
      that.$parent.statusName = '';
      that.$parent.refresh();
    },
    clearTime: function() {
      let that = this;
      that.tabOptions['tab' + that.selected].time.name = '全部时间';
      that.tabOptions['tab' + that.selected].time.id = '';
      that.$parent.beginTime = '';
      that.$parent.endTime = '';
      that.$parent.refresh();
    }
  }
}
</script>
<style lang="scss">
.query-tab {
  text-align: center;
  padding: 0px;
  border-bottom: 1px solid #dedede;
  font-size: 14px;
  .query-tab-tab {
    width: 80%;
  }
  .mint-popup-top {
    top: auto;
  }
  .top-fixed {
    position: fixed;
    width: 100%;
    background-color: #fff;
    z-index: 1;
  }
  .query-tab-query {
    width: 15%;
    text-align: right;
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
  }
  .mint-tab-item-label {
    font-size: 15px;
  }
  .mint-navbar .mint-tab-item {
    padding: 10px 0px;
    &.is-selected {
      border-bottom: 2px solid #EF4F4F;
      color: #EF4F4F;
    }
  }
  .query-tab-bottom {
    border-top: 1px solid #dedede;
    margin-top: 2px;
    background-color: #F6F6F6;
    div {
      height: 38px;
      line-height: 38px;
      padding: 0px;
      border-bottom: 1px solid #dedede;
    }
    .search-active{
      border-bottom: 0px;
      background-color: #ffffff;
    }
    .query-tab-bottom-org{
      width: 35%;
    }
    .query-tab-bottom-status{
      width: 30%;
      margin-left:-1px;
      margin-right:-1px;
      border-left: 1px solid #dedede;
    }
    .query-tab-bottom-time{
      width: 35%;
      border-left: 1px solid #dedede;
    }
  }
  .cg-query {
    .query-tab-bottom-org{
      border-left:0px;
      border-right: 0px;
    }
    .query-tab-bottom-status{
      border-left:0px;
      border-right: 0px;
      margin:0px;
    }
    .query-tab-bottom-time{
      border-left:0px;
      border-right: 0px;
    }
  }
  .heightauto {
    width: 101%;
    height: auto;
  }
  .has-query {
    padding: 5px;
  }
}
</style>
