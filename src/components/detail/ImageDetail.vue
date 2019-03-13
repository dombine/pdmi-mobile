<template>
  <div class="product-detail-img">
    <common-header class="head" :options="headerOptions()"></common-header>
    <div class="title_content"><span class="title"> {{title}} </span></div>
    <see-box class="imgbox">
      <swiper :options="swiperOption" class="swiper-box-full">
        <swiper-slide v-for="image in imgList" :key="image.path">
          <see-item :img="image"></see-item>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev my " slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </see-box>
    <operate-buttons ref="operate-buttons" :resourceId="resourceId" @load-item="loadItem"></operate-buttons>
    <operation-btns-popups ref="popups" :resourceId="resourceId" :catalog="catalog"
                           :operations="operationList"></operation-btns-popups>
  </div>
</template>

<script>
  require('swiper/dist/css/swiper.css')
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import CommonHeader from '../common/CommonHeader.vue'
  import OperateButtons from './OperateButtons.vue'
  import OperationBtnsPopups from './OperationBtnsPopups.vue'
  import VueSee from 'vue-see'
  import Vue from 'vue'
  import detailUtil from '../../utils/detailUtil'

  let dUtil = detailUtil();

  var options = {
    tapToClose: true,
    shareEl: false,
    fullscreenEl: false,
  }
  Vue.use(VueSee, options)
  export default {
    name: 'app',
    components: {
      swiperSlide, swiper, CommonHeader, OperateButtons, OperationBtnsPopups
    },
    data() {
      return {
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          spaceBetween: 30
        },
        fullSwiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          spaceBetween: 30
        },
        /* headerOptions: {
         title: '图片详情', align: 'center', backMethod: function () {
         router.push('/resourceMobile/product');
         }
         },*/
        resourceId: this.$route.params.resourceID,
        images: '',
        author: '',
        title: '',
        imgList: [],
        item: {},
        catalog: {},
        operationList: [],
        catalogVisible: false,
        auditVisible: false,
        departmentId: '',
        type: this.$route.params.type
      }
    },

    mounted: function () {
      this.resourceId = this.$route.params.resourceID
      this.loadResDetailData(this.resourceId, this.$global.userId);
      this.loadDetailInfo(this.resourceId);
    },

    methods: {

      headerOptions: function () {
        let that = this;
        return {
          title: '图片详情',
          align: 'left',
          styleObject: {'background-color': '#fff', 'color': '#000', 'border-bottom': '1px solid #dedede'},
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
          backMethod: function () {
            router.push("/resourceMobile/product");
          }
        }
      },
      loadCatalog: function () {
        this.catalogVisible = true;
      },
      loadItem: function (item) {
        this.item = item
        this.departmentId = this.handleDepartmentId(item.extendAttributes);
        this.catalog = this.handleCatalogs(item.extendAttributes)
      },
      handleDepartmentId: function (catalogs) {
        return dUtil.handleDepartmentId(catalogs);
      },
      handleImgs: function (images) {
        for (var i = 0; i < images.length; i++) {
          this.imgList.push({
            u: images[i].path,
            w: 500,
            h: 365,
            c: images[i].describe
          })
        }
//        console.log(this.imgList)
      },

      handleCatalogs: function (catalogs) {
        return dUtil.handleCatalogs(catalogs);
      },

      loadDetailInfo: function (resourceId) {
        let that = this
        dUtil.loadDetailInfo(resourceId, function (data) {
          that.operationList = data.operationlist;
        })
      },

      loadResDetailData: function (resourceId, userId) {
        let that = this
        dUtil.loadResDetailData(resourceId, userId, function (data) {
          that.title = data.resource.name;
          that.images = data.resource.NewResourceFiles;
          that.handleImgs(that.images);
        })
      }

    }

  }
</script>

<style lang="scss">
  .product-detail-img {
    margin-top: 0px !important;
    font-size: 16px;
    height: 100%;
    .head {
      --margin-bottom: 20% !important;
    }
    .swiper-box {
      width: 100%;
      height: 50%;
      margin: 0 auto;
    }
    .swiper-item {
      text-align: center;
      font-size: 18px;
      background: #fff;
      /* Center slide text vertically */
      /*display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;*/
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }
    .swiper-slide {
      img {
        display: block;
        margin: auto;
        height: 300px;
        width: 96%;
      }
      figure {
        margin: 0px;
      }
    }
    .full {
      width: 100%;
    }

    .imgbox {
      height: auto;
      width: auto;
    }
    figcaption {
      display: none;
    }
    figure {
      margin:0;
    }

    .pswp__caption__center {
      font-size: 20px;
      margin-bottom: 5%;
      word-wrap: break-word;
      word-break: normal;
      /* display: inline-block;*/
    }

    .title_content {
      padding: 20px;
    }
    .title {
      width: 90vw;
      --font-size: 22px;
      word-wrap: break-word;
      word-break: break-all;
      display: inline-block;
      line-height: 35px;
    }
    .title-tip {
      text-align: right;
      font-size: 12px;
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
