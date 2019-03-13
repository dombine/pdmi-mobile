<template>
  <div class="cgaudit-operator">
    <common-header :options="headerOptions"></common-header>
    <div class="set-title">审核设置</div>
    <div class="set-container">
      <div class="set-body" @click="organizationPopupVisible = true">
        <img class="img-left" src="../../assets/image/icon/机构.svg" alt="">
        <img class="img-right" src="../../assets/image/icon/左箭头.svg" alt="">
        <div placeholder="位置">{{organization.name}}</div>
      </div>

      <div class="set-body" @click="authorPopupVisible = true">
        <img class="img-left" src="../../assets/image/icon/一人.svg" alt="">
        <img class="img-right" src="../../assets/image/icon/左箭头.svg" alt="">
        <div placeholder="报审批人">{{author.name}}</div>
      </div>

      <div class="set-body" @click="selecttopicPopupVisible = true">
        <img class="img-left" src="../../assets/image/selecttopic.png" alt="">
        <img class="img-right" src="../../assets/image/icon/左箭头.svg" alt="">
        <div placeholder="选题" class="last">{{selecttopic.name}}</div>
      </div>
    </div>
    <div class="set-button">
      <mt-button type="danger" size="large" @click="commit()"> 提交审核</mt-button>
    </div>

    <mt-popup class="query-popup" v-model="organizationPopupVisible" position="top" :modal=false style="height:100%">
      <organization :options="organizationOptions()"></organization>
    </mt-popup>

    <mt-popup class="query-popup" v-model="authorPopupVisible" position="top" :modal=false style="height:100%">
      <audit-author :options="authorOptions()"></audit-author>
    </mt-popup>

    <mt-popup class="query-popup" v-model="selecttopicPopupVisible" position="top" :modal=false style="height:100%">
      <select-topic :options="selecttopicOptions()"></select-topic>
    </mt-popup>
  </div>
</template>

<script>
  import CommonHeader from '@/components/common/CommonHeader.vue'
  import Organization from '@/components/product/Organization.vue'
  import AuditAuthor from '@/components/product/AuditAuthor.vue'
  import SelectTopic from '@/components/product/SelectTopic.vue'
  import { Toast } from 'mint-ui';

  export default {
    name: 'app',
    data() {
      return {
        resourceID: this.$route.params.resourceID,
        headerOptions: { title: '提交审核', align: 'center' ,topIndex : false, backMethod:this.options.backMethod},
        organization: { id: '', name: '', param: '' },
        selecttopic: { id: '', name: '', param: '' },
        keyWord: '',
        source: '',
        author: { id: '', name: '', param: '' },
        creator: '',
        tData: [],
        aData: [],
        sData: [],
        organizationPopupVisible: false,
        authorPopupVisible: false,
        selecttopicPopupVisible: false
      }
    },
    props: ['options'],
    components: {
      CommonHeader, Organization, AuditAuthor, SelectTopic, Toast
    },
    mounted() {
      this.initOrgainzationData(this.organization.param);
    },
    watch: {
      'organization.id': function(val) {
        this.author.id = '';
        this.author.name = '';
        this.initAuthorData(val);
      },
      authorPopupVisible: function(val) {
        if (val && !this.organization.id) {
          Toast({
            message: '请先选择主目录'
          });
          setTimeout(() => {
            $jq(".mint-toast").addClass("toastindex");
          }, 500);
          setTimeout(() => {
            $jq(".mint-toast").removeClass("toastindex");
          }, 2500);
          this.authorPopupVisible = false;
          return;
        }
      },
      selecttopicPopupVisible: function(val) {
        if (val) {
          this.initSelectTopicData(this.selecttopic.param);
        }
      }
    },
    methods: {
      organizationOptions: function() {
        let that = this;
        return {
          treeData: this.tData,
          //search : true,
          format: true,
          selected: that.organization.id,
          selectedName: that.organization.name || '全部组织',
          headerOptions: { title: '设置主目录' },
          callBack: function(selectedNode) {
            that.organization.id = selectedNode.id;
            that.organization.name = selectedNode.text;
            that.organizationPopupVisible = false;
          },
          backMethod: function() {
            that.organizationPopupVisible = false;
          }
        }
      },
      initOrgainzationData: function(keyWord) {
        if (keyWord) this.organization.param = keyWord;
        let vm = this;
        let userId = vm.$global.userId;
        let url = vm.$global.getUrlByAppId("CRE") + "/api/authorization/organization/load/mainclass";
        vm.$http.put(url, JSON.stringify({
          "userId": userId,
          "privilegePrefix": "PID_PRODUCT_FLODER_INCOMMINGDATA"
        }))
          .then(function(res) {
            vm.tData = res.data.organizationList;
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      },
      authorOptions: function() {
        let that = this;
        return {
          data: this.aData,
          search: true,
          selected: that.author.id,
          callBack: function(selectedNode) {
            that.author.id = selectedNode.id;
            that.author.name = selectedNode.name;
            that.authorPopupVisible = false;
          },
          backMethod: function() {
            that.authorPopupVisible = false;
          },
          refreshCallBack: this.initAuthorData
        }
      },
      initAuthorData: function(organizationId, keyWord) {
        if (!organizationId) organizationId = this.organization.id;
        if (keyWord) this.author.param = keyWord;
        let vm = this;
        let userId = vm.$global.userId;
        let url = vm.$global.getUrlByAppId("CRE") + "/api/authorization/users/new";
        let data = {};
        let privilegeInfos = [];
        let privilegeInfo = {};
        privilegeInfo.privilegeId = "PID_PRODUCT_STATUS_AUDIT";
        privilegeInfo.status = "待审核";
        privilegeInfo.departmentId = organizationId || '-';
        privilegeInfos.push(privilegeInfo);
        data.privilegeInfos = privilegeInfos;
        data.userName = keyWord && keyWord.trim();
        vm.$http.put(url, JSON.stringify(data))
          .then(function(res) {
            vm.aData = res.data.userList;
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      },
      selecttopicOptions: function() {
        let that = this;
        return {
          data: this.sData,
          search: true,
          selected: that.selecttopic.id,
          callBack: function(selectedNode) {
            that.selecttopic.id = selectedNode.id;
            that.selecttopic.name = selectedNode.title;
            that.selecttopicPopupVisible = false;
          },
          backMethod: function() {
            that.selecttopicPopupVisible = false;
          },
          refreshCallBack: that.initSelectTopicData
        }
      },
      initSelectTopicData: function(keyWord) {
        if (keyWord) this.selecttopic.param = keyWord;
        let vm = this;
        let userId = vm.$global.userId;
        let url = vm.$global.getUrlByAppId("PEOPLEDAILYAPI") + "/api/querySelectList";
        let data = {
          "userId": userId,
          "searchContent": "",
          "start": 0,
          "limit": 20,
          "department": "",
          "direction": "DESC"
        };
        data.searchContent = keyWord && keyWord.trim();
        vm.$http({
          url: url,
          data: JSON.stringify(data),
          method: 'post',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(function(res) {
            vm.sData = res.data.records;
          })
          .catch(function(error) {
            console.log(error.response.data);
          })
      },
      commit: function() {
        if (!this.organization.id) {
          Toast('主目录不能为空');
//          Toast({
//            message: '主目录不能为空',
//            className: 'toastindex',
//            duration:-1
//          });
          setTimeout(() => {
            $jq(".mint-toast").addClass("toastindex");
          }, 500);
          setTimeout(() => {
            $jq(".mint-toast").removeClass("toastindex");
          }, 2500);
          return;
        }
        let vm = this;
        let departmentId=vm.organization.id;
        let topidId=vm.selecttopic.id;
        let auditorId=vm.author.id || vm.organization.id;
        this.options.callBack(departmentId,topidId,auditorId);
      }
    }
  }
</script>

<style lang="scss">
  .toastindex{
    z-index:9999;
  }
  .cgaudit-operator {
    .organization .tree-menu,.audit-author .content-body {
      max-height: 90%;
    }
    .query-popup {
      width: 100%;
    }
    .set-button {
      margin-top: 20px;
      text-align: center;
      .mint-button {
        display: inline-block;
        width: 80%;
        height: 35px;
      }
    }
    .set-title {
      height: 25px;
      line-height: 25px;
      font-size: 14px;
      padding: 5px 5px 5px 20px;
      background-color: #F6F6F6;
    }
    .set-container {
      border: 1px solid #dedede;
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
          width: 20px;
          height: 20px;
          margin-top: 10px;
          margin-left: 5px;
        }
        .img-right {
          float: right;
          width: 20px;
          height: 20px;
          margin-top: 10px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
