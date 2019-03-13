<template>
  <div class="move-operator">
    <common-header :options="headerOptions"></common-header>
    <div class="set-container">
      <div class="set-body">
        <img class="img-left" src="../../../assets/image/organization.png" alt="">
        <div placeholder="请选择组织机构">{{organization.name}}</div>
      </div>
      <organization :options="organizationOptions()"></organization>
    </div>

    <div class="set-button">
      <mt-button type="danger" size="large" @click="commit()">移动</mt-button>
    </div>

  </div>
</template>

<script>
import CommonHeader from '../../common/CommonHeader.vue'
import Organization from '../Organization.vue'
import { Toast } from 'mint-ui';

export default {
  name: 'app',
  data() {
    return {
      resourceID: this.$route.params.resourceID,
      selectedOrgId: this.$route.params.organizationId,
      from: this.$route.meta.prevPage,
      headerOptions: { title: '移动', align: 'left' },
      organization: { id: '', name: '', param: '' },
      keyWord: '',
      tData: []
    }
  },
  components: {
    CommonHeader, Organization, Toast
  },
  mounted() {
    this.initOrgainzationData(this.organization.param);
  },
  watch: {

  },
  methods: {
    organizationOptions: function() {
      let that = this;
      return {
        treeData: this.tData,
        //search : true,
        selectedOrgId: this.selectedOrgId,
        format: true,
        hasButton: false,
        selected: that.organization.id,
        headerOptions: { title: '设置主目录', visiable: false },
        callBack: function(selectedNode) {
          that.organization.id = selectedNode.id;
          that.organization.name = selectedNode.text;
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
    commit: function() {
      if (!this.organization.id) {
        Toast('组织机构不能为空');
        return;
      }
      let vm = this;
      let url = vm.$global.getUrlByAppId("RESOURCEMANAGER") + '/resources/move?resourceIdList=' + this.resourceID;
      vm.$http({
        url: url,
        data: JSON.stringify({
          departmentId: vm.organization.id
        }),
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(function(res) {
          Toast('执行成功');
          if (vm.from === 'product') {
            router.push({ name: 'product', params: { 'refresh': true } });
          } else if (vm.from.indexOf("Detail") > -1) {
            window.localStorage.setItem("detail-operator", true);
            router.go(-1);
          }
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    }
  }
}
</script>

<style lang="scss">
.move-operator {
  .query-popup {
    width: 100%;
    height: 100%;
  }
  .set-button {
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
    border-bottom: 0px;
    .last {
      border-bottom: 0px !important;
    }
    .set-body {
      div {
        font-size: 15px;
        height: 30px;
        line-height: 30px;
        padding: 5px;
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
