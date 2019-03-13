<template>
  <div id="product" class="container product-container">
    <!--头部控件-->
    <common-header :options="headerOptions" :moreOpera="createMoreOpera()"></common-header>

    <!--查询控件-->
    <product-query ref="product-query" :visable="productQueryVisable" :options="selected" @product-query-change="PruductQueryChange">
    </product-query>

    <div class="line-body" ref="lineBody" id="productList" v-infinite-scroll="loadMore" infinite-scroll-immediate-check="false" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <div class="line-row" v-for="(item, index) in list" :key="item.id">
        <!--每一行数据的控件-->
        <line-row :options="selected" :item="item" :index="index" @on-delete-row="deleteRow"></line-row>
      </div>
      <div v-if="list.length == 0 && !loading" class="load-tip">
        <div class="inline-block">没有符合条件的数据</div>
      </div>
      <div v-if="loading" class="load-tip">
        <img src="../../assets/image/loading.gif" alt="">
        <div class="inline-block">正在加载...</div>
      </div>
    </div>

    <div class="create-button">
      <create></create>
    </div>

  </div>
</template>
<script>
import Vue from 'vue'
import CommonHeader from '../common/CommonHeader.vue'
import LineRow from './LineRow.vue'
import ProductQuery from './ProductQuery.vue'
import Create from './PaletteButton.vue'

export default {
  name: 'Product',
  components: {
    CommonHeader, LineRow, ProductQuery, Create
  },
  data() {
    return {
      headerOptions: {  // 顶部显示的文字和位置
        title: '媒资库',
        topIndex : true,
        align: 'center',
        queryVisiable: true,
        showQuery: function() {
          router.push('/resourceMobile/search');
        },
      },

      list: [], // 列表数据
      loading: false, // 正在加载的标识

      // 分页相关
      start: 0,
      limit: 10,
      totalCount: 0,
      currentPage: 1,
      totalPage: 1,

      orderBy: 'lastModify desc',
      content: '',
      statusName: '待审核',
      statusExp: '',
      beginTime: '',
      endTime: '',
      organizationId: '',
      selected: '1', // 1--全部，2--我的

      privilegeReady: false,
      GlobalPrivilege: {},
      privilegesAfterClickTree: [],
      scrollBefore: 0,
      productQueryVisable: true,
      isLive: true,
      extendResultFields: "作者,机构ID,机构名称,产品状态,创作时间,签发资源ID,审核人ID,来源"
    }
  },
  //product.vue使用了 keep-alive 缓存，每次进入这个页面时会触发 activated 方法
  activated() {
    let that = this;
    that.isLive = true;
    $jq(window).scrollTop(this.$route.meta.scrollTop);
    let refresh = this.$route.params.refresh || false;
    let detailOperator = window.localStorage.getItem("detail-operator") || false;
    if (refresh || detailOperator)
      that.backRefresh();

  },
  //防止其他页面触发此页面的查询方法
  deactivated() {
    this.isLive = false;
  },
  //页面第一次加载时的执行方法，默认草稿状态，去加载对应的权限和数据
  mounted() {
    let that = this;
    this.initAllPrivilegeByUserId(this.search);
    /*window.onscroll = function(){
      let after = document.documentElement.scrollTop;
      if (that.scrollBefore < (after - 77)) {
        that.scrollBefore = after;
        that.productQueryVisable = false;
      }
      if (that.scrollBefore > (after + 5)) {
        that.scrollBefore = after;
        that.productQueryVisable = true;
      }
    }*/
    $jq(window).on('scroll', function(e) {
      let after = $jq(this).scrollTop();
      if (that.scrollBefore < (after - 77)) {
        that.scrollBefore = after;
        that.productQueryVisable = false;
      }
      if (that.scrollBefore > (after + 5)) {
        that.scrollBefore = after;
        that.productQueryVisable = true;
      }
    })
  },
  watch: {
    organizationId: function(val) {
      if (!val) {
        this.privilegesAfterClickTree = this.GlobalPrivilege.all;
      } else {
        this.privilegesAfterClickTree = this.GlobalPrivilege[val];
      }
    }
  },
  methods: {
    //刷新当前列表
    backRefresh: function() {
      let param = {};
      param.refresh = true;
      param.url = this.getUrl("basicsearch");
      param.start = 0;//刷新默认开始为0
      param.limit = this.limit;
      param.orderBy = this.orderBy;
      param.conditions = this.getSearchConditions();
      param.extendResultFields = this.extendResultFields;
      if (this.content) {
        param.url = this.getUrl("search");
      }
      console.log(param.conditions);
      this.searchData(param);
    },

    //刷新一条数据，去后台加载最新的数据替换掉list中的数据
    refreshOneDataByResourceId: function(resourceId) {
      let param = {};
      param.url = this.$global.getUrlByAppId("RESOURCEMANAGER") + "/basicsearch";
      let conditions = [];
      conditions.push({ id: "id", value: resourceId });
      param.conditions = conditions;
      param.start = 0;
      param.limit = 1;
      param.extendResultFields = "作者,机构ID,机构名称,产品状态,创作时间,签发资源ID,审核人ID";
      let vm = this;
      let userId = vm.$global.userId;
      vm.$http.post(param.url,
        qs.stringify({ para: JSON.stringify(param), userId: userId }))
        .then(function(res) {
          let newData = res.data.items[0];
          vm.refreshList(newData);
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },

    //改变数组中对象属性的值，vue默认不会触发重新渲染，要用 $set 手动触发
    refreshList: function(newData) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id == newData.id) {
          this.list[i] = newData;
          this.$set(this.list, i, this.list[i]);
          break;
        }
      }
    },

    //根据用户ID初始化用户产品相关的权限
    initAllPrivilegeByUserId: function(callback) {
      //console.log("load privilegeByUserId...");
      if (this.privilegeReady) {
        callback();
        return;
      }
      let vm = this;
      let url = vm.$global.getUrlByAppId("CRE") + '/api/authorization/privilege/load/mainclass';
      let userId = vm.$global.userId;
      vm.$http({
        url: url,
        data: JSON.stringify({
          "userId": userId,
          "privilegePrefix": "PID_PRODUCT"
        }),
        method: 'put'
      })
        .then(function(res) {
          if (res.data.commonResponse.success) {
            vm.initAllPrivilegeToDept(res.data.privilegeList);
            vm.privilegeReady = true;
            callback();
          }
        })
        .catch(function(error) {
          console.log(error.response.data);
        })
    },
    //将相关的权限进行组装
    initAllPrivilegeToDept: function(privileges) {
      if (!privileges || privileges.length == 0)
        return;
      for (let i = 0; i < privileges.length; i++) {
        let pobj = privileges[i];
        let dlist = pobj.departmentIdList || [];
        for (let j = 0; j < dlist.length; j++) {
          if (!this.GlobalPrivilege[dlist[j]]) {
            this.GlobalPrivilege[dlist[j]] = [];
          }
          this.$global.arrayPushNotExistItem(this.GlobalPrivilege[dlist[j]], pobj, "id");
        }
      }
      this.GlobalPrivilege.all = privileges;
      this.privilegesAfterClickTree = this.GlobalPrivilege.all || [];
    },

    //状态的转化
    transLateStatus: function(status, isText) {
      let result;
      if (isText) {
        if (status == "待审核")
          result = 1;
        else if (status == "审核通过")
          result = 2;
        else if (status == "被驳回")
          result = 3;
        else if (status == "已签发")
          result = 4;
        else
          result = 0;
      } else {
        if (status == 1)
          result = "待审核";
        else if (status == 2)
          result = "审核通过";
        else if (status == 3)
          result = "被驳回";
        else if (status == 4)
          result = "已签发";
        else
          result = "-";
      }
      return result;
    },

    //获取某个状态权限的部门IdList，如果是草稿，返回空
    getDepartmentIdList: function(privilegeId, status) {
      let c = this;
      status = c.transLateStatus(status, true);
      if (status == 0)
        return "";
      if (!c.privilegesAfterClickTree || c.privilegesAfterClickTree.length == 0)
        return "-";

      var idList = [];
      for (var i = 0; i < c.privilegesAfterClickTree.length; i++) {
        var ele = c.privilegesAfterClickTree[i];
        if (ele.id == privilegeId) {
          var departmentIdList = ele.departmentIdList || [];
          //此处departmentIdList与statusList是一一对应的
          if (status == 1 || status == 2 || status == 3 || status == 4) {
            var statusList = ele.statusList || [];
            for (var j = 0; j < statusList.length; j++) {
              var sele = statusList[j];
              if (sele + "" == status + "") {
                c.$global.arrayPushNotExistItem(idList, departmentIdList[j]);
              }
            }
          } else {
            idList = departmentIdList;
          }
          break;
        }
      }
      idList.push("-");//加 - 是为了防止没有权限时 idList为空，后台处理时会默认当成全部处理
      return idList.join(" or ");
    },

    //删除一行时触发的方法
    deleteRow: function(value) {
      this.$global.arrayDelete(this.list, value, 'id');
    },
    //可以定义头部更多操作
    createMoreOpera: function() {

    },
    //加载更多数据
    loadMore: function() {
      if (!this.isLive) return;
      if (this.currentPage < this.totalPage) {
        this.currentPage = this.currentPage + 1;
        this.search();
      }
    },
    //主查询方法
    searchData: function(param) {
      let vm = this;
      this.loading = true;
      let userId = vm.$global.userId;
      vm.$http.post(param.url,
        qs.stringify({ para: JSON.stringify(param), userId: userId }))
        .then(function(res) {
          if (param.refresh) {
            vm.list = res.data.items || [];
          } else {
            vm.list = vm.list.concat(res.data.items || []);
          }
          vm.currentPage = res.data.currentPage;
          vm.totalPage = res.data.totalPage;
          vm.start = res.data.start;
          vm.loading = false;
        })
        .catch(function(error) {
          console.log(error.response.data);
          vm.loading = false;
        })
    },
    //顶部tab页签切换时执行的方法
    PruductQueryChange: function(val, tabObj) {
      this.selected = val;
      this.statusName = tabObj.status.id;
      if (tabObj.time.id) {
        this.beginTime = tabObj.time.id.split(',')[0];
        this.endTime = tabObj.time.id.split(',')[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.organizationId = tabObj.organization.id;
      this.refresh();
    },

    //刷新列表的方法，在机构id改变时，需要先将机构对应的权限信息加载处理。所有此处略微延迟200ms
    refresh: function() {
      let that = this;
      setTimeout(function() {
        that.list = [];
        that.currentPage = 1;
        that.search();
      }, 200);
    },
    //查询方法
    search: function() {
      let param = {};
      param.url = this.getUrl("basicsearch");
      param.start = (this.currentPage - 1) * this.limit;
      param.limit = this.limit;
      param.orderBy = this.orderBy;
      param.conditions = this.getSearchConditions();
      param.extendResultFields = this.extendResultFields;
      if (this.content) {
        param.url = this.getUrl("search");
      }
      console.log(param.conditions);
      this.searchData(param);
    },
    //条件组装
    getSearchConditions: function() {
      let conditions = [];

      //基本的默认条件，非文件夹类
      conditions.push({ id: "type", value: "7", operator: '1' });
      conditions.push({ "id": "FOLDERID", "value": "PRODUCT_ROOT_FOLDERID" });

      //我的签审
      if (this.selected == '2' && this.statusName != '已转审') {
        conditions.push({ id: '审核人ID', value: this.$global.userId });
      }
      //全部
      else if (this.selected == '1') {
        //只有浏览自己权限
        if (this.$global.arrayContains(this.privilegesAfterClickTree, { id: "PID_PRODUCT_MANUSCRIPT_BROWSER_SELF" }, 'id')) {
          conditions.push({ id: 'CREATORID', value: this.$global.userId });
        }
      }
      else if (this.selected == '4') {
        conditions.push({
          id: 'COLLECTORIDS',
          value: this.$global.userId,
          operator: '9'
        });
      }
      //我的草稿
      else {
        conditions.push({ id: 'CREATORID', value: this.$global.userId });
      }

      //状态条件
      if (this.statusName) {
        let departmentIdList = '-';
        if (this.statusName == '已转审') {
          conditions.push({ "id": "转审人ID", "value": this.$global.userId });
          conditions.push({ id: '产品状态', value: '待审核' });
          //根据状态取哪些部门有此状态的权限
          departmentIdList = this.getDepartmentIdList("PID_PRODUCT_STATUS_BROWSER", '待审核');
          conditions.push({ "id": "机构ID", "value": departmentIdList });
        } else {
          conditions.push({ id: '产品状态', value: this.statusName });
          //根据状态取哪些部门有此状态的权限
          departmentIdList = this.getDepartmentIdList("PID_PRODUCT_STATUS_BROWSER", this.statusName);
          if (departmentIdList)
            conditions.push({ "id": "机构ID", "value": departmentIdList });
        }
        //window.localStorage.setItem("product_org_param", departmentIdList);
      }

      //机构条件
      if (this.organizationId)
        conditions.push({ "id": "机构ID", "value": this.organizationId });

      //时间条件
      if (this.beginTime && this.endTime) {
        conditions.push({
          id: 'CREATED',
          value: this.beginTime + "," + this.endTime,
          dataType: 3,
          operator: 2
        });
      }
      return conditions;
    },
    getUrl: function(type) {
      if (type == 'basicsearch') {
        return this.$global.getUrlByAppId("RESOURCEMANAGER") + "/basicsearch";
      } else if (type == 'search') {
        this.$global.getUrlByAppId("RESOURCEMANAGER") + "/search";
      }
    }
  }
}
</script>
<style lang="scss">
.product-container {
  .line-body {
    padding-top: 76px;
  }
  .line-row {
    border-bottom: 1px solid #dedede;
    line-height: 22px;
  }
  .load-tip {
    text-align: center;
    line-height: 30px;
    margin-top: 10px;
    color: #000;
    font-size: 14px;
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
  }
  .query-popup {
    width: 100%;
    height: 80%;
  }
  .create-button {
    position: fixed;
    font-size: 16px;
    left: 10px;
    bottom: 10px;
  }
}
</style>
