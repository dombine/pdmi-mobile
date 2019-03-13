<template>
  <div class="new-text">
    <common-header :options="options"></common-header>
    <div class="new-text-content">
      <head-line ref="headline"></head-line>
      <div class="tip-content">
        <span class="tip">已输入{{ length }}个字</span>
      </div>
       <editor @change="updateData" :content="content" :height="500" :auto-height="true"
                  :show-module-name="false"></editor>
    </div>
    <div class="bottom-button">
      <foot-button v-if="!editable" :catalogue="Catalogue" v-bind:save="textSave" v-bind:commit="textCommit"></foot-button>
      <mt-button v-if="editable" class="footBtn" @click="editSave" type="danger" size="small">
        <img src="../../assets/image/icon/mini保存.svg" height="20px" width="20px" slot="icon"> 保存修改
      </mt-button>

      <mt-button v-if="editable" class="footBtn" @click="editCatalog" type="danger" size="small">
        <img src="../../assets/image/icon/mini编目.svg" height="20px" width="20px" slot="icon"> 修改编目
      </mt-button>
    </div>
    <mt-popup class="query-popup" v-model="cataloguePopupVisible" position="top" style="width:101%;height:100%">
      <Catalogue :options="catalogueOptions()"></Catalogue>
    </mt-popup>
    <mt-popup class="query-popup" v-model="auditPopupVisible" position="top" style="width:101%;height:100%" :modal=false>
      <Audit :options="auditOptions()"></Audit>
    </mt-popup>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'
import FootButton from '@/components/create/Button'
import HeadLine from '@/components/create/HeadLine'
import Catalogue from '@/components/create/Catalogue'
import Audit from '@/components/create/Audit'

import editorOptions from './../../assets/js/editorOptions'
import { Toast } from 'mint-ui'

import util from '../../utils/utils'

let Utils = util();
let reId = Utils.generateUUId();
let VueHtml5Editor = require('../../utils/editor.js').VueHtml5Editor;

const editor = new VueHtml5Editor(editorOptions(reId).options);
export default {
  components: { CommonHeader, FootButton, HeadLine, Toast, editor, Catalogue, Audit },
  data() {
    return {
      options: {
        title: '新建文本',
        align: 'center'
      },
      editorOptions: {},
      resourceId: '',
      fulltext: '',
      content: '',
      length: 0,
      username: '',
      editable: false,
      productStatus: '草稿',
      cataloguePopupVisible:false,//编目弹出是否显示
      catalog: {keyWord: '', source: '', creator: ''},//编目信息
      auditPopupVisible:false,//提交审核弹出是否显示
      audit: {departmentId: '', topidId: '', auditorId: ''},//提交审核信息
    }
  },

  mounted: function() {
    //this.controlTooBar();
    this.resourceId = reId;
    this.findUserByID(this.$global.userId);
    if (this.$route.params.resourceID) {
      this.resourceId = this.$route.params.resourceID;
      this.editable = true;
      this.options.title = '修改文本';
      this.loadResource(this.resourceId);
    }
  },

  watch: {
    content: "updateData"
  },

  methods: {

    editCatalog: function () {
      router.push('/resourceMobile/editAttrs/' + this.resourceId );
    },
    Catalogue: function () {
      this.cataloguePopupVisible=true;
    },
    catalogueOptions: function () {
      let that = this;
      return {
        callBack: function (catalog) {
          that.catalog.keyWord = catalog.keyWord;
          that.catalog.source = catalog.source;
          that.catalog.creator = catalog.creator;
          that.cataloguePopupVisible = false;
        }
      }
    },
    auditOptions: function () {
      let that = this;
      return {
        callBack: function (departmentId,topidId,auditorId) {
          that.audit.departmentId = departmentId;
          that.audit.topidId =topidId;
          that.audit.auditorId =auditorId;
          that.auditPopupVisible = false;
          that.newResource(true); //提交并且提交审核
        },
        backMethod: function () {
          that.auditPopupVisible = false;
        },
      }
    },
    loadResource(resourceId) {
      let that = this
      var url = this.$global.getUrlByAppId("PORTAL") + "/loadDetailInfo/" + resourceId;
      this.$http.get(url).then(function(response) {
        console.log(response.data)
        that.$refs.headline.head = response.data.yinti
        that.$refs.headline.headline = response.data.biaoti;
        that.$refs.headline.subhead = response.data.fubiaoti;
        that.content = response.data.html_content;
        if (that.$refs.headline.subhead) {
          that.$refs.headline.subheadVisible = true;
        }
        if (that.$refs.headline.head) {
          that.$refs.headline.headVisible = true;
        }

      }).catch(function(error) {
        console.log(error.response.data);
      })
    },
    editSave() {
      this.newResource(false)
    },

    updateData: function(data) {
      this.content = data
      this.length = data.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, "").length
    },
    textSave: function() {
      this.newResource(false);
    },
    textCommit: function() {
      this.auditPopupVisible=true;
      //this.newResource(true); //提交并且提交审核
    },
    newResource: function(auflg) {
      var that = this;
      //本地文件数量
      var params = {
        attachmentList: [],
        auditorName: '',
        authorName: this.catalog.creator,
        content: '<p>' + this.content + '<br/></p>',
        contentText: this.content.replace(/<[^>]+>/g, ""),
        editorId: this.$global.userId,
        eyebrowHead: this.$refs.headline.head,
        folderId: 'PRODUCT_ROOT_FOLDERID',
        keyWords: this.catalog.keyWord,
        productStatus: this.productStatus,
        source: this.catalog.source,
        subtitle: this.$refs.headline.subhead,
        title: this.$refs.headline.headline,
        topicName: ''
      }
      if (this.editable) {
          params.productStatus = this.getStateByResourceId();
      }else{
        if(auflg){
          params.productStatus = "待审核";
          params.privilegeDepID= this.audit.departmentId;
          params.topicId = this.audit.topidId;
          params.auditorId = this.audit.auditorId;
        }else{
          params.productStatus = "草稿";
        }
      }

      if (!this.$refs.headline.headline) {
        Toast("标题不能为空")
        return
      }
      if (!this.content) {
        Toast("内容不能为空")
        return
      }
      console.log(params)
      this.$http.put(this.$global.getUrlByAppId("CRE") + '/api/resources/richText/' + this.resourceId + '?newVersion=fasle', JSON.stringify(params))
        .then(function(response) {
          console.log(response)
          if (response.status === 200) {
            that.onCreateSuccess(true, auflg, that.resourceId)
            Toast("保存成功")
          }
        })
        .catch(function(error) {
          that.onCreateSuccess(false);
        })
    },
    onCreateSuccess: function(flag, auflg, resourceId) {
      window.localStorage.setItem("detail-operator", true);
      if (flag) {
        router.push({ name: 'product', params: { 'refresh': true } });
      } else {
        Toast('创建失败');
      }
    },
    findUserByID: function(userId) {
      let that = this
      this.$http.get(this.$global.getUrlByAppId("CRE") + '/api/authorization/findUsersById?userIds=' + userId)
        .then(function(res) {
          if (res.status === 200) {
            that.username = res.data.userList[0].name
          }
        })
        .catch(function() {
          that.username = ''
        })
    },
    //      controlTooBar: function () {
    //        let $ = window.$jq;
    //        $(function () {
    //          var bar = $(".vue-html5-editor");
    //          var headH = $(".mint-header").height();
    //          var barH = bar.offset().top;
    //          $(window).scroll(function () {
    //            var scroH = $(this).scrollTop();
    //            if (scroH >= barH - headH) {
    //              $(".toolbar").css({"position": "fixed", "top": 40, "margin-left": 10, "maargin-right" : 10});
    //              $(".dashboard").css({"position": "fixed", "top": 40, "margin-left": 10, "maargin-right" : 10});
    //              $(".tip").css({"position": "fixed", "top":  barH});
    //            } else if (scroH < barH) {
    //              $(".toolbar").css({"position": "static"});
    //              $(".tip").css({"position": "static"});
    //            }
    //          });
    //        })
    //      }

    getStateByResourceId: function() {
      this.$http.put(this.$global.getUrlByAppId("PORTAL") + '/getStateByResourceId?resourceId=' + this.resourceId)
        .then(function(response) {
          if (response.status === 200) {
              return response.data;
          }
        })
        .catch(function(error) {
            return '';
        })
    }
  },
}
</script>

<style lang="scss">
.new-text {
  .vue-html5-editor {
    .content {
      min-height: 290px !important;
      margin-top: 5%
    }
  }
  .tip-content {
    height: 0px;
    .tip {
      margin-left: 70%;
      text-align: right;
      font-size: xx-small;
      color: red;
      background-color: white;
    }
  }

  .new-text-content img {
    width: 90%;
    height: 100%;
  }

 /* .footBtn {
    text-align: center;
    margin: 0 auto;
  }*/
  .bottom-button {
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #dedede;
    text-align: center;
  }
  .toolbar {
    z-index: 0 !important;
    margin: 0 auto;
    text-align: center;
  }
  .mint-button--small {
    /*display: block;*/

  }
}
</style>
