<template>
  <div class="audit">
    <common-header :options="headerOptions"></common-header>
    <!--<div>审核意见</div>-->
    <div>
      <!--<el-input placeholder="请输入审核意见" class="advice" type="textarea" v-model="auditAdvice" :rows="6"></el-input>-->
      <textarea placeholder="请输入审核意见" class="advice" v-model="auditAdvice" cols="20" rows="10"></textarea>
    </div>
    <div class="foot">
      <mt-button class="pass" style="position: absolute; left: 15%;" size="small" type="danger" @click="auditPass">
        审核通过
      </mt-button>
      <mt-button class="back" size="small" type="danger" style="position: absolute; right: 15%;" @click="auditBack">审核退回
      </mt-button>
    </div>
    <!--style="position: absolute; bottom: 10%; right: 20%;"-->
  </div>
</template>
<script>
  import CommonHeader from '../common/CommonHeader.vue'
  import {Toast} from 'mint-ui'

  export default {
    data() {
      return {
        headerOptions: {
          title: '审核', align: 'left', backMethod: function () {
            router.go(-1);
          }
        },
        resourceId: this.$route.params.resourceID,
        auditAdvice: ''
      }
    },
    components: {CommonHeader},
    methods: {
      auditPass: function () {
        if (this.auditAdvice.length === 0) {
          Toast({
            message: '请填写审核意见',
            position: 'bottom'
          });
          return;
        }
        let that = this;
        let url = this.$global.getUrlByAppId("PORTAL") + '/resource/' + that.resourceId + '/audit?userId=' + this.$global.userId;
        this.$http({
          url: url,
          data: JSON.stringify({"status": "审核通过", "comment": that.auditAdvice}),
          method: 'post',
          headers: {'Content-Type': 'text/plain'}
        })
          .then(function (response) {
            that.auditVisible = false;
            Toast('审核通过');
            router.push({name: 'product', params: {'refresh': true}});
          })
          .catch(function (error) {
            console.log(error.response.data);
          })
      },
      auditBack: function () {
        if (this.auditAdvice.length === 0) {
          Toast({
            message: '请填写审核意见',
            position: 'bottom'
          });
          return;
        }
        let that = this;
        let url = this.$global.getUrlByAppId("PORTAL") + '/resource/' + that.resourceId + '/audit?userId=' + this.$global.userId;
        this.$http({
          url: url,
          data: JSON.stringify({"status": "被驳回", "comment": that.auditAdvice}),
          method: 'post',
          headers: {'Content-Type': 'text/plain'}
        })
          .then(function (response) {
            that.auditVisible = false;
            Toast('审核驳回');
            router.push({name: 'product', params: {'refresh': true}})
          })
          .catch(function (error) {
            console.log(error.response.data);
          })
      }
    }
  }
</script>
<style lang="scss">
  .audit {
    .advice {
      box-sizing: border-box !important;
      width: 100vw;
    }

    .foot {
      margin-top: 10px;
    }
  }
</style>
