<!--查询组件:: result: 查询结果 search: 查询方法
 由父组件传入
-->
<template>
  <div class="search-content common" ref="searchContent">
    <!--<mt-search @keyup.enter.native="submit"
            v-model="keyWord"
            cancel-text="取消"
            placeholder="搜索"
      >
      </mt-search>-->
    <div class="mint-search">
      <div class="mint-searchbar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input @keyup.enter="submit" v-model="keyWord" type="search" placeholder="搜索" class="mint-searchbar-core">
        </div>
        <a v-show="!keyWord" class="mint-searchbar-cancel" @click="close">取消</a>
        <a v-show="keyWord" class="mint-searchbar-cancel" @click="submit">搜索</a>
      </div>
    </div>
    <div class="search-history" ref="searchHistory">
      <div class="search-mid-content" v-for="(item, index) in opts.history" :key="item.id">
        <div class="inline-block search-mid-content-txt" @click="searchHistory(item)">{{item}}
        </div>
        <div class="search-mid-content-img inline-block" @click="setKeyWord(item)">
          <img src="../../assets/image/arrow-left-top.png" alt="">
        </div>
      </div>
    </div>
    <!--<div class="search-bottom-btn">
        <mt-button @click="submit()" type="primary" size="small">确定</mt-button>
        <mt-button @click="close()" type="danger" size="small">关闭</mt-button>
      </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWord: '',
      opts: this.options
    }
  },
  props: ['options'],
  watch: {
    options(val) {
      this.opts = val;
    },
    opts(val) {
      this.$emit("on-options-change", val);
    }
  },
  methods: {
    searchHistory: function(value) {
      this.keyWord = value;
      this.submit();
    },
    submit: function() {
      if (this.keyWord) {
        this.options.submitCallBack(this.keyWord);
        this.close();
      }
    },
    close: function() {
      this.options.cancelCallBack();
      this.keyWord = '';
    },
    setKeyWord: function(value) {
      this.keyWord = value;
      return false;
    }
  }
}
</script>

<style lang="scss">
.search-content.common {
  height: 100%;
  overflow: auto;
  .mint-search {
    position: absolute;
    width: 100%;
    height: auto;
  }
  .search-history {
    height: 100%;
    margin-top: 52px;
    text-align: left;
  }
  .search-mid-content {
    padding: 10px 10px 10px 20px;
    border-bottom: 1px solid #dedede;
    div {
      height: 30px;
      line-height: 30px;
    }
    img {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .search-mid-content-txt {
    width: 90%;
  }
  .search-mid-content-img {
    width: 10%;
  }
  .search-bottom-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>
