<template lang="html">
  <div class="select-topic" :class="[!headerOptions.visiable?'head-hidden':'']">
    <common-header v-if="headerOptions.visiable" :options="headerOptions"></common-header>
    <div v-if="options.search" class="result-search">
      <div class="mint-searchbar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input v-model="keyWord" type="search" placeholder="搜索" class="mint-searchbar-core" v-on:keyup.enter="selectNumOne()">
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content-input">
          选题列表
          <img v-show="options.selected" src="../../assets/image/close.png" alt="" @click="clear">
      </div>
      <div class="content-body">
        <div v-for="item in data" :key="item.id" @click="onSelect(item)" :class="[initSelect(item.id)?'active':'']"> <span v-html="redDecorate(item.title)">{{redDecorate(item.title)}}</span>
          <i class="icon" :class="[initSelect(item.id)?'selected':'']"></i>
        </div>
      </div>
    </div>
    </div>
</template>

<script>

import CommonHeader from '../common/CommonHeader.vue'
import $ from 'jquery'

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      data: this.options.data,
      keyWord: '',
      headerOptions: {
        visiable: true,
        align: 'center',
        title: '选题',
        styleObject: { 'background-color': '#ffffff', 'color': '#333' ,'border-bottom': '1px solid #dedede'},
        backMethod: this.options.backMethod
      }
    }
  },
  props: ['options'],
  mounted() {
    if (this.options.headerOptions)
      $.extend(this.headerOptions, this.options.headerOptions);

  },
  watch: {
    options: function(val) {
      this.data = this.options.data;
    },
    keyWord: function(val) {
      this.options.refreshCallBack(val);
    }
  },
  methods: {
    initSelect: function(value) {
      return this.options.selected === value;
    },
    onSelect: function(item) {
      this.options.callBack(item);
    },
    clear: function() {
      this.options.callBack({ id: '', title: '' });
    },
    redDecorate: function(value) {
      if (this.keyWord)
        return value.replace(new RegExp(this.keyWord, "gm"), "<red>" + this.keyWord + "</red>");
      else
        return value;
    },
    selectNumOne: function() {
      this.onSelect(this.data[0]);
    }
  }
}
</script>

<style lang="scss">
.select-topic {
  red {
    color: #ef4f4f;
    font-weight: bold;
  }
  font-size:15px;
  margin-top: 40px;
  text-align:left;
  height:100%;
  border-top: 1px solid #dedede;
  .icon.selected {
    float: right;
    margin: 5px 10px 0px 0px;
    background-image: url(../../assets/image/selected.png);
  }
  .active {
    color: red;
  }
  .mint-searchbar {
    padding: 0px 0px 1px 0px;
  }
  .content {
    height: 100%;
    overflow: auto;
  }
  .content-input {
    position: absolute;
    background-color: #fff;
    height: 25px;
    line-height: 25px;
    padding: 5px 0px 5px 10px;
    font-size: 14px;
    color: #888;
    width: 100%;
    border: 1px solid #dedede;
    border-top: 0px;
    img {
      float: right;
      margin: 3px 22px;
    }
  }
  .content-body {
    margin-top: 35px;
    border: 1px solid #dedede;
    border-top: 0px;
    min-height: 300px;
    max-height: 350px;
    div {
      overflow: hidden;
      white-space: nowrap;
      word-break: break-all;
      text-overflow: ellipsis;
      height: 25px;
      padding: 5px 0px 5px 10px;
      line-height: 30px;
      border-bottom: 1px solid #dedede;
    }
  }
}
</style>
