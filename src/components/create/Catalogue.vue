<template>
  <div class="cgaudit-operator">
    <common-header :options="headerOptions"></common-header>
    <div class="set-title">编目信息</div>
    <div class="set-container">
      <div class="set-body">
        <img class="img-left" src="../../assets/image/icon/多人.svg" alt="">
        <div>
          <input type="text" name="" value="" placeholder="作者" v-model="catalog.creator">
        </div>
      </div>
      <div class="set-body">
        <img class="img-left" src="../../assets/image/source.png" alt="">
        <div>
          <input type="text" name="" value="" placeholder="来源" v-model="catalog.source">
        </div>
      </div>
      <div class="set-body">
        <img class="img-left" src="../../assets/image/word.png" alt="">
        <div class="last">
          <input type="text" name="" value="" placeholder="关键字" v-model="catalog.keyWord">
        </div>
      </div>
    </div>
    <div class="set-button">
      <mt-button type="danger" size="large" @click="commit()">确定</mt-button>
    </div>
  </div>
</template>

<script>
  import CommonHeader from '@/components/common/CommonHeader.vue'
  import {Toast} from 'mint-ui';

  export default {
    name: 'app',
    data() {
      return {
        catalog: {keyWord: '', source: '', creator: this.$global.userName},
        headerOptions: {title: '编目信息', align: 'center', topIndex : false, backMethod:this.commit}
      }
    },
    props: ['options'],
    components: {
      CommonHeader,Toast
    },
    methods: {
      commit: function () {
        this.options.callBack(this.catalog);
      }
    }
  }
</script>

<style lang="scss">
  .cgaudit-operator {
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
      margin-top:40px;
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
