<template>
  <div class="product-detail-text">
    <common-header :options="headerOptions()"></common-header>
    <div class="tab-detail">
      <div class="title_content"><span class="title title-onrow"> {{title}}</span></div>
      <hr>
      <div class="author_content">作者: <span class="author">{{author}}</span></div>
      <div class="content" v-html="content"></div>
    </div>
    <operate-buttons ref="operate-buttons" :resourceId="resourceId" @load-item="loadItem"></operate-buttons>
    <operate-btns-popups ref="popups" :ccid="item.ccid" :resourceId="resourceId" :catalog="catalog" :operations="operationList" :attachments="attchmentList"></operate-btns-popups>
  </div>
</template>
<script>
  import CommonHeader from '../common/CommonHeader.vue'
  import {Toast} from "mint-ui";
  import OperateButtons from './OperateButtons.vue'
  import OperateBtnsPopups from './OperationBtnsPopups.vue'

  import detailUtil from '../../utils/detailUtil'

  let dUtil = detailUtil();
  export default {
    components: { CommonHeader, OperateButtons, OperateBtnsPopups},
    data () {
      return {
        resourceId: this.$route.params.resourceID,
        title: '',
        content: '',
        author: '',
        /*headerOptions: {title: '文本详情', align: 'center',backMethod : function(){
          router.push('/resourceMobile/product');
        }},*/
        item: {},
        catalog: {},
        operationList: [],
        attchmentList: [],
        departmentId: '',
        type: this.$route.params.type,
      }
    },
    mounted: function () {
      this.loadDetailInfo(this.resourceId);
      this.loadAttchments();
    },
    methods: {
      headerOptions:function(){
          let that = this;
        return {title: '文本详情', align: 'left',styleObject:{'background-color':'#fff','color':'#000','border-bottom': '1px solid #dedede'},

          moreButtonsVisable : this.type == 'audit',
          moreButtons : [
            {
              name : '转审',
              callback: function(){
                router.push('/resourceMobile/turn_audit/' + that.resourceId + '/' + that.departmentId)
              }
            },{
              name: '审核',
              callback: function () {
                router.push('/resourceMobile/audit/' + that.resourceId)
              }
            }
          ],
          backMethod : function(){
            router.push("/resourceMobile/product");
          }
        }
      },
      loadItem: function (item) {
        this.item = item;
        this.catalog = this.handleCatalogs( item.extendAttributes);
        this.departmentId = this.handleDepartmentId(item.extendAttributes);
      },
      handleCatalogs: function (catalogs) {
        return dUtil.handleCatalogs(catalogs);
      },
      handleDepartmentId : function (catalogs) {
          return dUtil.handleDepartmentId(catalogs);
      },
      loadDetailInfo: function (resourceId) {
        let that = this;
        dUtil.loadDetailInfo(resourceId,function(data){
          that.title = data.biaoti;
          that.author = data.author;
          that.content = data.html_content;
          that.operationList = data.operationlist;
        });
      },
      loadAttchments: function () {
        let that = this
        var url = this.$global.getUrlByAppId("CRE") + "/api/resources/richText/" + this.resourceId + "/attachments?{}";
        this.$http.get(url).then(function (response) {
            console.log(response)
          that.attchmentList = response.data;
          console.log(that.attchmentList)
        }).catch(function (error) {
          Toast("获取附件失败");
        })
      },
    }
  }
</script>
<style lang="scss">
  .product-detail-text {
    font-size: 16px;
    height: 100%;
    .tab-detail {
      img {
        width: 90%;
        height: 100%;
      }
    }
    .title_content {
      margin-top: 15%;
      padding-bottom: 20px;
      padding-left: 1.5em;
      padding-right: 1.5em;
      --width: 100vw;
      box-sizing: border-box;
    }
    .title {
      width: 90vw;
      --font-size: 22px;
      word-wrap: break-word;
      word-break: normal;
      display: inline-block;
      line-height: 35px;
    }
    .title-onrow{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
    .author_content {
      text-indent: 2em;
      font-size: 10px !important;
      margin: 10px 0px 10px 0px;
    }
    .author {
      font-size: 9px !important;
      text-indent: 1em;
    }
    .content {
      margin-left: 1.5em;
      margin-right: 1.5em;
      margin-bottom: 55px;
      word-break: break-all;
    }
    // .footer {
    //   position: fixed;
    //   width: 100%;
    //   height: 56px;
    //   border-top:1px solid #dedede;
    //   bottom: 0px;
    //   box-sizing: border-box;
    // }
  }
</style>
