<template>
  <div class="issuer-operator">
    <common-header :options="headerOptions"></common-header>
    <div class="set-container">
      <div class="set-body">
        <div class="title pull-left">
          签发状态：
        </div>
        <div class="swich">
          <mt-switch v-model="switchValue"></mt-switch>
        </div>
      </div>
    </div>
    <div class="set-button">
      <mt-button type="danger" size="large" @click="commit()">签发</mt-button>
    </div>

  </div>
</template>

<script>
import CommonHeader from '../../common/CommonHeader.vue'
import { Toast, Switch } from 'mint-ui';

export default {
  name: 'app',
  data() {
    return {
      resourceID: this.$route.params.resourceID,
      from: this.$route.meta.prevPage,
      headerOptions: { title: '签发', align: 'left' },
      newspaper: 1,
      newsStatus: 0,
      switchValue: false
    }
  },
  components: {
    CommonHeader, Toast, "mt-switch": Switch
  },
  mounted() {

  },
  watch: {
    switchValue: function(val) {
      this.newsStatus = val ? 1 : 0;
    }
  },
  methods: {
    organizationOptions: function() {
      let that = this;
      return {
        treeData: this.tData,
        //search : true,
        selectedOrgId: this.selectedOrgId,
        format: true,
        hasButton: true,
        selected: that.organization.id,
        headerOptions: { title: '设置主目录', visiable: false },
        callBack: function(selectedNode) {
          that.organization.id = selectedNode.id;
          that.organization.name = selectedNode.text;
        }
      }
    },
    commit: function() {
      let vm = this;
      let url = vm.$global.getUrlByAppId("RESOURCEMANAGER") + '/resources/issuer?resourceIdList=' + this.resourceID;
      vm.$http({
        url: url,
        data: JSON.stringify({ templateId: "", newspaper: this.newspaper, columnId: "", newsStatus: this.newsStatus }),
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
.issuer-operator {
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

    border-bottom: 0px;
    .last {
      border-bottom: 0px !important;
    }
    .set-body {
      border-bottom: 1px solid #dedede;
      font-size: 16px;
      margin-top: 60px;
      padding: 15px;
      .title {
        margin-top: 3px;
      }
    }
  }
}
</style>
