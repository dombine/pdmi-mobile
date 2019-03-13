<template>
  <div class="search-content" ref="searchContent">
    <common-header :options="options"></common-header>
    <div class="search-content-top">
      <div class="mint-search">
        <div class="mint-searchbar">
          <div class="mint-searchbar-inner">
            <i class="mintui mintui-search"></i>
            <input @keyup.enter="submit" v-model="keyWord" type="search" placeholder="请输入关键字" class="mint-searchbar-core">
          </div>
          <!-- <a v-show="!keyWord" class="mint-searchbar-cancel" @click="close">取消</a>
              <a v-show="keyWord" class="mint-searchbar-cancel" @click="submit">搜索</a> -->
        </div>
      </div>
      <div class="search-history" v-show="totalCount != 0">
        <div class="inline-block search-mid-content-txt">搜索结果</div>
        <div class="inline-block search-mid-content-txt">共有{{totalCount}}条符合条件</div>
      </div>
    </div>
    <div class="search-result" v-infinite-scroll="loadMore" infinite-scroll-immediate-check="false" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <div class="search-mid-content" v-for="item in list" :key="item.id">
        <div class="" v-html="redDecorate(item.name)" @click="gotoDetail(item)"> {{redDecorate(item.name)}} </div>
      </div>
      <div v-if="list.length == 0 && !loading && keyWord && keyWord.trim()" class="load-tip bottom-tip">
        <div class="inline-block">没有符合条件的数据</div>
      </div>
      <div v-if="loading" class="load-tip">
        <img src="../../assets/image/loading.gif" alt="">
        <div class="inline-block">正在加载...</div>
      </div>
    </div>

    <!--<div class="search-bottom-btn">
          <mt-button @click="submit()" type="primary" size="small">确定</mt-button>
          <mt-button @click="close()" type="danger" size="small">关闭</mt-button>
        </div>-->
  </div>
</template>

<script>
import CommonHeader from '../common/CommonHeader.vue'
import util from '../../utils/utils.js'

let Utils = util();

export default {
  components: {
    CommonHeader
  },
  data() {
    return {
      keyWord: '',
      options: {
        title: '搜索',
        align: 'center',
        backMethod : function(){
          router.push('/resourceMobile/product');
        }
      },
      list: [],
      start: 0, // 分页相关
      limit: 20,
      totalCount: 0,
      currentPage: 1,
      totalPage: 1,
      loading: false,
      orderBy: 'created desc',
      bottomWord: false,
      isLive: true
    }
  },
  watch: {
    keyWord: function(val) {
      if (val && val.trim()) {
        this.currentPage = 1;
        this.search();
      } else {
        this.list = [];
        this.totalCount = 0;
      }
    }
  },
  activated() {
    this.isLive = true;
    $jq(window).scrollTop(this.$route.meta.scrollTop);
  },
  deactivated() {
    this.isLive = false;
  },
  methods: {
    gotoDetail: function(item) {
      Utils.gotoDetail(item);
    },

    submit: function() {

    },
    close: function() {
      router.go(-1);
    },
    redDecorate: function(value) {
      if (this.keyWord)
        return value.replace(new RegExp(this.keyWord, "gm"), "<red>" + this.keyWord + "</red>");
      else
        return value;
    },
    loadMore: function() {
      if (!this.isLive) return;
      if (this.currentPage < this.totalPage) {
        this.currentPage = this.currentPage + 1;
        this.search();
      }
    },
    searchData: function(param) {
      let vm = this;
      this.loading = true;
      let userId = vm.$global.userId;
      vm.$http.post(param.url, qs.stringify({ para: JSON.stringify(param), userId: userId }))
        .then(function(res) {
          if (vm.currentPage === 1)
            vm.list = res.data.items || [];
          else
            vm.list = vm.list.concat(res.data.items);
          vm.currentPage = res.data.currentPage;
          vm.totalPage = res.data.totalPage;
          vm.totalCount = res.data.totalCount;
          vm.loading = false;
        })
        .catch(function(error) {
          console.log(error.response.data);
          vm.loading = false;
          vm.list = [];
        })
    },
    search: function() {
      let param = {};
      param.url = this.$global.getUrlByAppId("RESOURCEMANAGER") + "/search";
      param.start = (this.currentPage - 1) * this.limit;
      param.limit = this.limit;
      param.orderBy = this.orderBy;
      param.conditions = this.getSearchConditions();
      console.log(param);
      this.searchData(param);
    },
    getSearchConditions: function() {
      let conditions = [];

      //基本的默认条件，非文件夹类
      conditions.push({ id: "type", value: "7", operator: '1' });
      conditions.push({ "id": "FOLDERID", "value": "PRODUCT_ROOT_FOLDERID" });
      if (this.keyWord && this.keyWord.trim())
        conditions.push({ id: 'CONTENT', value: this.keyWord, operator: '9' });

      return conditions;
    }
  }
}
</script>

<style lang="scss">
.search-content {
  font-size: 16px;
  .search-content-top {
    position: fixed;
    width: 100%;
  }
  .search-result {
    padding-top: 80px;
    red {
      color: #ef4f4f;
      font-weight: bold;
    }
    em {
      color: #ef4f4f;
      font-weight: bold;
      font-style: normal;
    }
  }
  .mint-search {
    width: 100%;
    height: auto;
  }
  .search-history {
    text-align: left;
    border-bottom: 1px solid #dedede;
    background-color: #fff;
    div {
      line-height: 30px;
      padding: 2px 5px 2px 20px;
      font-size: 14px;
      color: #888;
    }
  }
  .search-mid-content {
    font-size: 15px;
    padding: 5px 10px 5px 20px;
    border-bottom: 1px solid #dedede;
    div {
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      word-break: break-all;
      text-overflow: ellipsis;
    }
  }
  .mint-searchbar {
    padding: 1px 0px;
    background-color: #dedede;
    .mint-searchbar-core {
      --background-color: #ededed;
      --padding: 5px;
    }
    .mint-searchbar-inner {
      height: 35px;
    }
    a.mint-searchbar-cancel {
      margin: 0px 10px;
    }
  }
  .load-tip {
    text-align: center;
    line-height: 30px;
    margin-top: 0px;
    color: #000;
    font-size: 14px;
    img {
      width: 20px;
      vertical-align: middle;
    }
  }
  .bottom-tip {
    color: #888 !important;
    img {
      width: 20px;
      vertical-align: middle;
    }
  }
}
</style>
