<template>
  <div class="audit">
    <common-header :options="headerOptions"></common-header>

    <div class="content">
      <div class="set-body" @click="authorPopupVisible = true">
        <img class="img-left" src="../../assets/image/icon/一人.svg" alt="">
        <img class="img-right" src="../../assets/image/icon/左箭头.svg" alt="">
        <div placeholder="报审批人" class="last">{{author.name}}</div>
      </div>

      <div>
        <textarea placeholder="请输入审核意见" class="advice" v-model="auditAdvice" cols="20" rows="10"></textarea>
      </div>
      <div class="foot">
        <mt-button class="turn" size="small" type="danger" @click="turnAudit">提交</mt-button>
      </div>
    </div>

    <mt-popup class="query-popup" v-model="authorPopupVisible" position="right">
      <audit-author :options="authorOptions()"></audit-author>
    </mt-popup>
  </div>
</template>


<script>

import CommonHeader from '../common/CommonHeader.vue'
import AuditAuthor from '../product/AuditAuthor.vue'
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      headerOptions: {
        title: '转审', align: 'left', backMethod: function() {
          router.go(-1);
        }
      },
      resourceId: this.$route.params.resourceID,
      auditAdvice: '',
      departmentId: this.$route.params.departmentId,
      userList: [],
      options: {},
      authorPopupVisible: false,
      author: { id: '', name: '', param: '' },
    }
  },
  components: { CommonHeader, AuditAuthor },
  mounted: function() {
    this.initAuthorData(this.departmentId);
  },
  methods: {
    authorOptions: function() {
      let that = this;
      return {
        data: this.userList,
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
          vm.userList = vm.handleUserList(res.data.userList);
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },

    turnAudit: function() {
      if (this.auditAdvice.length == 0) {
        Toast({
          message: '请填写转审意见',
          position: 'bottom'
        });
        return;
      }
      if (this.author.id == '') {
        Toast({
          message: '请选择报审批人',
          position: 'bottom'
        });
        return;
      }
      let that = this;
      let url = this.$global.getUrlByAppId("PORTAL") + '/resource/' + that.resourceId + '/audit?userId=' + this.$global.userId;

      this.$http({
        url: url,
        data: JSON.stringify({ "status": "转审", "comment": that.auditAdvice, "auditorId": that.author.id }),
        method: 'post',
        headers: { 'Content-Type': 'text/plain' }
      })
        .then(function(response) {

          that.auditVisible = false;
          Toast('执行成功');
          router.push({ name: 'product', params: { 'refresh' : true}})
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },

    handleUserList: function(data) {

      var index = 0;
      var currentId = this.$global.userId;
      for (var i = 0; i < data.length; i++) {
        if (currentId == data[i].id) {
          index = i;
          break;
        }
      }
      data.splice(1, 1);
      return data;
    }
  },
}

</script>


<style lang="scss">
.audit {
  .advice {
    box-sizing: border-box !important;
    width: 100vw;
  }

  .foot {
    margin: 0 auto;
    text-align: center;
  }

  .query-popup {
    width: 100%;
    height: 100%;
  }
  .turn {
    width: 100px;
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
</style>
