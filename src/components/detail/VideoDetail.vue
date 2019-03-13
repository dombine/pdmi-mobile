<template>
  <div class="video-detail">
    <common-header :options="headerOptions()"></common-header>
    <div class="title_content"><span class="title">作者: {{author}}</span></div>
    <div>
      <video-player v-if="source" ref="player" :option="option" :poster="poster" :source="source" :time="time">
      </video-player>
    </div>
    <operate-buttons ref="operate-buttons" :resourceId="resourceId" @load-item="loadItem"></operate-buttons>
    <operation-btns-popups ref="popups" :resourceId="resourceId" :catalog="catalog"
                           :operations="operationList"></operation-btns-popups>
  </div>
</template>

<script>
  import CommonHeader from '../common/CommonHeader.vue'
  import VideoPlayer from 'vue-h-video-play'
  import OperateButtons from './OperateButtons.vue'
  import OperationBtnsPopups from './OperationBtnsPopups.vue'
  import {Toast} from 'mint-ui'
  import detailUtil from '../../utils/detailUtil'

  let dUtil = detailUtil();

  export default {
    components: {CommonHeader, OperateButtons, VideoPlayer, Toast, OperationBtnsPopups},
    data () {
      return {
        resourceId: this.$route.params.resourceID,
        author: '',/*
        headerOptions: {
          title: '音视频详情', align: 'center', backMethod: function () {
            router.push('/resourceMobile/product');
          }
        },*/
        item: {},
        catalog: {},
        operationList: [],
        departmentId: '',
        type: this.$route.params.type,
        option: {
          width: '100%',
          height: '200px',
          playMode: 'inline',//inline or fullScreen or defalut(默认行为ios 全屏,android行内)
          playIcon: 'time', //default or time
          autoPlay: false,//true or false
          /*beforePlay: function () {
           //可以再这里加上是否是wifi环境的判断
           return true;
           }*/
        },
        poster: '',
        source: '',
        time: '开始'
      }
    },


    mounted: function () {
      this.resourceId = this.$route.params.resourceID;
      this.loadDetailInfo(this.resourceId);
      this.loadResDetailData(this.resourceId, this.$global.userId);

    },

    methods: {
      headerOptions: function () {
        let that = this;
        return {
          title: '音视频详情', align: 'left', styleObject: {'background-color': '#fff', 'color': '#000','border-bottom': '1px solid #dedede'},

          moreButtonsVisable: this.type == 'audit',
          moreButtons: [
            {
              name: '转审',
              callback: function () {
                router.push('/resourceMobile/turn_audit/' + that.resourceId + '/' + that.departmentId)
              }
            }, {
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
        this.catalog = this.handleCatalogs(item.extendAttributes);
        this.departmentId = this.handleDepartmentId(item.extendAttributes);
      },
      handleCatalogs: function (catalogs) {
        return dUtil.handleCatalogs(catalogs);
      },
      handleDepartmentId : function (catalogs) {
        return dUtil.handleDepartmentId(catalogs);
      },
      loadResDetailData: function (resourceId, userId) {
        let that = this;
        dUtil.loadResDetailData(resourceId, userId, function (data) {
          that.source = data.resource.fullFileName;
          that.poster = data.resource.iconUrl;
        });
      },
      loadDetailInfo: function (resourceId) {
        let that = this;
        dUtil.loadDetailInfo(resourceId, function (data) {
          that.author = data.resou.creatorName;
          that.operationList = data.operationlist;
        })
      },
    },
  }
</script>


<style lang="scss">
  .video-detail {
    font-size: 16px;
    height: 100%;
    img {
      width: 90%;
      height: 100%;
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
      word-break: break-all;
      display: inline-block;
      line-height: 35px;
    }

    .footer {
      position: fixed;
      width: 99%;
      height: 10%;
      bottom: 0px;
      box-sizing: border-box;
    }
  }
</style>
