<template lang="html">
  <div class="organization" :class="[!headerOptions.visiable?'head-hidden':'']">
    <common-header v-if="headerOptions.visiable" :options="headerOptions"></common-header>
    <div v-if="options.search" class="organization-search">
      <div class="mint-searchbar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input v-model="keyWord" type="search" placeholder="搜索" class="mint-searchbar-core">
        </div>
      </div>
    </div>
    <div v-if="headerOptions.visiable" class="content-input">
        组织机构列表
        <img v-show="options.selected" src="../../assets/image/close.png" alt="" @click="clear">
    </div>
    <div class="tree-menu" ref="treeMenu">
      <ul v-for="item in data" :key="item.id">
       <tree-view :model="item" :options="options"></tree-view>
      </ul>
    </div>
    <div class="bottom-button" v-if="options.hasButton">
      <mt-button type="default" size="small" @click="clear()">重置
        </mt-button><mt-button type="danger" size="small" @click="commit()">确定</mt-button>
    </div>
    </div>
</template>

<script>

import TreeView from '../common/TreeView.vue'
import CommonHeader from '../common/CommonHeader.vue'
import $ from 'jquery'

export default {
  components: {
    CommonHeader, TreeView
  },
  data() {
    return {
      data: this.options.treeData,
      title: this.options.selectedName,
      keyWord: '',
      headerOptions: {
        visiable: true,
        align: 'center',
        title: '',
        styleObject: { 'background-color': '#ffffff', 'color': '#333','border-bottom': '1px solid #dedede' },
        backMethod: this.options.backMethod
      }
    }
  },
  props: ['options'],
  mounted() {
    let that = this;

    if (this.options.headerOptions)
      $.extend(this.headerOptions, this.options.headerOptions);

  },
  watch: {
    options: function(val) {
      this.data = val.treeData;
      if (!this.options.format) return;
      this.data = this.formatData(this.data);
      val.treeData = this.data;
      this.title = val.selectedName;
    }
  },
  methods: {

    formatData: function(data) {
      var vm = this;
      if (!data || data.length == 0) return;

      var findChildren = function(data, node) {
        node.children = [];
        for (var j = 0; j < data.length; j++) {
          if (data[j].parent == node.id || data[j].parentId == node.id) {
            node.children.push(data[j]);
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        findChildren(data, data[i]);
      }

      var newData = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId === '#') {
          //data[i].open = true;
          newData.push(data[i]);
        }
      }
      this.options.format = false;
      return newData;
    },
    clear: function() {
      this.options.selected = '';
      this.options.callBack({ id: '', text: '' });
    }
  }
}
</script>
<style lang="scss">
.organization {
  font-size: 14px;
  margin-top: 40px;
  text-align: left;
  height: 100%;
  border-top: 1px solid #dedede;
  .content-input {
    --background-color: #dedede;
    height: 25px;
    line-height: 25px;
    padding: 5px 0px 5px 10px;
    font-size: 14px;
    color: #888;

    border: 1px solid #dedede;
    border-top: 0px;
    img {
      float: right;
      margin: 3px 20px;
    }
  }
  .tree-menu {
    overflow: auto;
    font-size: 16px;
    max-height: 350px;
    min-height: 300px;
    border-bottom: 1px solid #dedede;
  }
  .organization-tree .active {
    color: red;
    font-weight: bold;
  }
  .mint-searchbar {
    padding: 0px 0px 1px 0px;
  }
  .bottom-button button {
    width: 50%;
    padding: 0px;
    border-radius: 0px;
  }
}
</style>
