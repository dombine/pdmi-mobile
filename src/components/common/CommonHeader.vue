<template>
  <div id="header" class="header">
    <!-- <mt-header fixed :title="titleCenter" v-bind:style="styleObject">
          <mt-button slot="left" icon="back" @click="headerBack(options.backMethod)">{{ titleLeft }}</mt-button>
          <mt-button v-if="moreOpera.visiable" icon="more" slot="right" @click="showMoreOpera()"></mt-button>
          <mt-button v-if="options.queryVisiable" icon="search"  slot="right" @click="headerBack(options.showQuery)">{{ titleRight }}</mt-button>
        </mt-header> -->

    <!-- 以下自己实现 mint-ui 的 mt-header -->
    <header class="mint-header is-fixed" :class="[options.topIndex?'top-zindex':'']" :style="styleObject">
      <div class="mint-header-button is-left">
        <button class="mint-button mint-button--default mint-button--normal" @click="headerBack(options.backMethod)">
          <span class="mint-button-icon">
            <i class="mintui mintui-back"></i>
          </span>
          <label class="mint-button-text">{{ titleLeft }}</label>
        </button>
      </div>
      <div class="mint-header-title" @click="scrollToTop()">{{titleCenter}}</div>
      <div class="mint-header-button is-right" v-if="options.queryVisiable">
        <button class="mint-button mint-button--default mint-button--normal" @click="headerBack(options.showQuery)">
          <span class="mint-button-icon">
            <i class="mintui mintui-search"></i>
          </span>
          <label class="mint-button-text">{{ titleRight }}</label>
        </button>
      </div>
      <div class="mint-header-button is-right" v-if="!options.queryVisiable">
        <button class="mint-button mint-button--default mint-button--normal" @click="showMoreOpera()"
                v-if="moreOpera.visiable">
          <span class="mint-button-icon">
            <i class="mintui mintui-search"></i>
          </span>
          <label class="mint-button-text">{{ titleRight }}</label>
        </button>
        <div class="inline-block more-buttons" v-if="options.moreButtonsVisable">
          <button class="mint-button mint-button--danger mint-button--small" v-for="button in options.moreButtons"
                  :key="button.name" @click="callFun(button.callback)">
            <label class="mint-button-text">{{button.name}}</label>
          </button>
        </div>
      </div>
    </header>
    <!-- 结束 -->

    <!-- 定义更多操作的弹出modal -->
    <mt-popup class="query-popup query-tab-bottom-popup" v-model="popupVisible" :modal="modal"
              :closeOnClickModal="closeOnClickModal" position="bottom">
      <div class="more-opera" v-for="item in moreOpera.operas" :key="item.title" @click="callMethod(item.method)">
        {{item.title}}
      </div>
    </mt-popup>

  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    name: 'CommonHeader',
    props: {
      options: {
        type: Object,
        default: function () {
          return {
            topIndex: true,
            align: 'center',
            title: '',
            queryVisiable: false,
            styleObject: {},
            moreButtonsVisable: false,
            moreButtons: []
          }
        }
      },
      moreOpera: {
        type: Object,
        default: function () {
          return {
            visiable: false,
            operas: []
          }
        }
      }
    },
    mounted() {
      if (this.options.styleObject)
        $.extend(this.styleObject, this.options.styleObject);
    },
    data() {
      return {
        popupVisible: false,
        closeOnClickModal: true,
        modal: true,
        styleObject: {'background-color': '#ef4f4f', 'font-size': '16px'}
      }
    },
    methods: {
      headerBack: function (method) {
        if (method) {
          method();
        } else {
          router.go(-1);
        }
      },
      showMoreOpera: function () {
        if (!this.moreOpera.operas) return;
        this.popupVisible = true;
      },
      callMethod: function (method) {
        if (method)
          method();
        this.popupVisible = false;
      },
      scrollToTop: function () {
        document.documentElement.scrollTop = 0;
      },
      callFun: function (methodName) {
        if (methodName)
          methodName();
      }
    },
    computed: {
      titleLeft: function () {
        return this.options.align === 'left' ? this.options.title : '';
      },
      titleCenter: function () {
        return this.options.align === 'center' ? this.options.title : '';
      },
      titleRight: function () {
        return this.options.align === 'right' ? this.options.title : '';
      }
    }
  }
</script>
<style lang="scss">
  .header {
    font-size: 16px;
    .more-opera {
      line-height: 40px;
      height: 40px;
      padding: 5px 5px 5px 25px;
      border-top: 1px solid #dedede;
    }
    .query-popup {
      width: 100%;
      height: auto;
    }
    div.mint-header-title {
      height: 100%;
      line-height: 40px;
    }
    .more-buttons {
      button {
        color: #fff;
        background-color: #ef4f4f;
        display: inline-block;
        font-size: 14px;
        padding: 0 12px;
        height: 30px;
        margin: 0px 1px;
      }
    }
  }
</style>
