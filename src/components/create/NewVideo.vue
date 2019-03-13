<template>
  <div class="new-video">
    <CommonHeader :options="options"></CommonHeader>

    <div class="container">
      <mt-field placeholder="请输入标题" v-model="headline"></mt-field>
      <div class="z_photo">
        <div class="z_file" v-if="show">
          <input type="file" id="file" :value="value" ccept=".ts,.flv,avi,.wmv,.rm,.rmvb,.mp4,.3gp,.mkv,.wav,.mp3,.s48" @change='videoChange' />
        </div>
        <div class="z_addImg" v-for='(item ,index ) in videos' :key="item.id">
          <img src="../../assets/image/video.png" @touchstart="touchstart(index)" @touchend="touchend(index)" :class="{ imgborder: index==selectItem }">
        </div>
        <div class="progress">
          <mt-progress :value="proValue">
            <div slot="end" style="font-size:12px;">{{proValue}}%</div>
          </mt-progress>
        </div>
        <div class="description">
          <mt-field placeholder="视频说明" type="textarea" rows="4" v-model="videodesc"></mt-field>
        </div>
      </div>
    </div>
    <FootButton :catalogue="Catalogue" :save="videoSave" :commit="videoCommit"></FootButton>
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
import axios from 'axios'
import { MessageBox, Toast } from 'mint-ui'
import util from '../../utils/utils'

let Utils = util();

export default {

  components: {
    CommonHeader,
    FootButton,
    HeadLine,
    Catalogue,
    Audit
  },
  data() {
    return {
      options: {
        title: '新建音频视频',
        align: 'center'
      },
      headline: '',
      videos: [],
      fileMap: new Map(),
      uploadMap: new Map(),
      value: '',
      starttime: 0,
      selectItem: 0,
      videodesc: '',
      show: true,
      proValue: 0,
      cancel: null,
      cataloguePopupVisible:false,//编目弹出是否显示
      catalog: {keyWord: '', source: '', creator: ''},//编目信息
      auditPopupVisible:false,//提交审核弹出是否显示
      audit: {departmentId: '', topidId: '', auditorId: ''},//提交审核信息
    }
  },
  watch: {
    videodesc(curVal) {
      if (this.videos.length > 0)
        this.videos[this.selectItem].videodesc = curVal;
    }
  },
  methods: {
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
    videoSave: function() {
      this.newResource(false);
    },
    videoCommit: function() {
      this.auditPopupVisible=true;
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
    newResource: function(auflg) {
      var _this = this;
      //本地文件数量
      var localFileCnt = this.fileMap.size;
      //文件名称
      var resoruceName = this.headline.trim();
      if (localFileCnt <= 0) {
        Toast('请上传本地文件');
        return;
      }
      if (resoruceName === "") {
        Toast("文件名称不能为空");
        return;
      }
      ////先创建资源
      var data = {};
      //资源名称
      data.resourceName = resoruceName;
      //编目数据
      var ccData = {};
      ccData["来源"] = this.catalog.source;
      ccData["作者"] = this.catalog.creator;
      ccData["创作时间"] = this.$global.dateFormat(new Date(), "yyyy/MM/dd");
      ccData["产品类型"] = '';
      ccData["关键词"] = this.catalog.keyWord;
      ccData["描述"] = '';
      if(auflg){
        data.productStatus = "待审核";
        data.departmentId= this.audit.departmentId;
        data.topicId = this.audit.topidId;
        data.auditorId = this.audit.auditorId;
      }else{
        data.productStatus = "草稿";
      }
      data.ccData = ccData;
      //资源类型，产品/素材
      data.libraryType = "产品";
      //如果选择了本地文件，需要填写文件的扩展名
      if (localFileCnt > 0) {
        var fileName = this.fileMap.get(this.videos[0].id).name;
        data.fileExtend = fileName.substr(fileName.indexOf('.'));
      }
      //调用创建资源接口
      let url = this.$global.getUrlByAppId("RESOURCEMANAGER") + "/v2/newResource?userId=" + this.$global.userId;
      _this.$http({
        url: url,
        method: "post",
        headers: { 'Content-Type': 'text/plain' },
        data: JSON.stringify(data)
      }).then(function(res) {
        let data = res.data;
        let resourceId = data.resourceId;
        //如果选择了本地文件，还需要上传本地文件
        if (localFileCnt > 0) {
          _this.send(data.resourceId)
            .then(function() {
              _this.onCreateSuccess(true, auflg, resourceId);
            }, function() {
              _this.onCreateSuccess(false);
            })
            .catch(function() {
              _this.onCreateSuccess(false);
            });
          //如果没有选择本地文件，直接提示完成
        } else {
          _this.onCreateSuccess(true, auflg, resourceId);
        }
      }).catch(function(err) {
        console.log(err);
        _this.onCreateSuccess(false);
      });
    },
    onCreateSuccess: function(flag, auflg, resourceId) {
      if (flag) {
        router.push({ name: 'product', params: { 'refresh': true } });
      } else {
        Toast('创建失败');
      }
    },
    touchstart: function(index) {
      this.starttime = new Date().getTime();
      this.selectItem = index;
      this.videodesc = this.videos[index].videodesc;
    },
    touchend: function(index) {
      let _this = this;
      if (new Date().getTime() - _this.starttime > 500) {
        MessageBox.confirm("确定要删除吗？").then(action => {
          let id = _this.videos[index].id;
          //在临时文件夹中删除 add by dongbing
          if (_this.uploadMap.get(id) != null) {
            let url = _this.$global.getUrlByAppId("CRE") + "/uploadFiles/temp/delete";
            _this.$http({
              url: url,
              data: JSON.stringify({ "fullName": _this.uploadMap.get(id).fullName })
            }).then(function(res) {
              _this.fileMap.delete(id);
              _this.uploadMap.delete(id);
              _this.videos.splice(index, 1);
              Toast('删除成功');
              _this.show = true;
              _this.proValue = 0;
            }).catch(function(err) {
              console.log("error:" + err);
              Toast('删除失败！');
            });
          } else {
            _this.cancel();
            _this.videos.splice(index, 1);
            Toast('删除成功');
            _this.show = true;
            _this.proValue = 0;
          }
        }).catch(err => {
        });
      }
    },
    videoChange: function(event) {
      let files = event.target.files;
      var rightType = new Array(".ts", ".flv", ".asf", ".avi", ".wm", ".wmp", ".wmv", ".ram", ".rm", ".rmvb",
        ".rp", ".rpm", ".rt", ".smi", ".smil", ".m1v", ".m2p", ".m2t", ".m2ts", ".m2v", ".mp2v", ".mpe",
        ".mpeg", ".mpg", ".mpv2", ".pss", ".pva", ".tp", ".tpr", ".m4b", ".m4p", ".m4v", ".mp4", ".mpeg4",
        ".3g2", ".3gp", ".3gp2", ".3gpp", ".mov", ".qt", ".f4v", ".hlv", ".ifo", ".vob", ".amv", ".bik",
        ".csf", ".divx", ".evo", ".ivm", ".mkv", ".mod", ".mts", ".ogm", ".pmp", ".scm", ".tod", ".vp6",
        ".webm", ".xlmv", ".mkv", ".mxf", ".gxf", ".dat", ".dv", ".dav", ".mp3", ".s48", ".wav");
      let flag = this.$global.checkSuffix(files, rightType);
      if (!flag) {
        Toast("请上传正确格式!");
        return;
      }
      if (this.headline === "") {
        var fileName = files[0].name;
        this.headline = fileName.substr(0, fileName.indexOf('.'));
      }
      let that = this;
      if (files.size <= 0) return;
      that.show = false;
      for (let i = 0; i < files.length; i++) {
        //生成uuid作为文件的唯一标识
        let id = Utils.generateUUId();
        let file = files[i];
        //将文件保存入map中，用于传输
        that.fileMap.set(id, file);
        let img = {};
        //img.url = window.URL.createObjectURL(file);
        img.id = id;
        img.description = "";
        that.videos.push(img);
        if (this.videos.length == 1)//第一张默认选中
          this.videodesc = '';
        that.sendToTemp(id)
          .then(function(data) {
            if (data.isSuccess) {
              Toast('上传成功');
            } else {
              Toast('上传失败');
            }
          }, function() {
            Toast('上传失败');
          })
          .catch(function(err) {
            console.log("error:" + err);
          });
        that.value = null;
      }
    },
    sendToTemp: function(id) {
      let _this = this;
      //返回一个promise对象
      return new Promise(function(resolve, reject) {
        let total = _this.fileMap.size;
        let file = _this.fileMap.get(id);
        //组织form参数
        let data = new FormData();
        data.append("file", file);
        data.append("id", id);
        data.append("newResourceFlag", true);
        data.append("fileListCount", total);
        data.append("fileIndex", _this.fileMap.size - 1);
        //调用ajax post方法上传
        let url = _this.$global.getUrlByAppId("CRE") + "/uploadFiles/" + id + "/temp";
        let CancelToken = _this.$http.CancelToken;
        _this.$http({
          url: url,
          method: 'post',
          data: data,
          onUploadProgress: function(progressEvent) {
            // 对原生进度事件的处理
            var loaded = event.loaded;
            var total = event.total;
            _this.proValue = Math.floor(100 * loaded / total);
          },
          cancelToken: new CancelToken(function executor(c) {
            _this.cancel = c;
          })
          //上传成功回调
        }).then(function(res) {
          let data = res.data;
          _this.uploadMap.set(data.id, data);//将上传的文件信息记录
          resolve(data);
        }).catch(function(err) {
          console.log("error:" + err);
          reject(file);
        });
      });
    },
    send: function(resourceId) {
      var _this = this;
      //返回一个promise对象
      return new Promise(function(resolve, reject) {
        var total = _this.fileMap.size;
        var sucCnt = 0;
        for (var i = 0; i < _this.videos.length; i++) {
          (function() {
            var id = _this.videos[i].id;
            var file = _this.fileMap.get(id);

            //组织form参数
            var data = new FormData();
            data.append("id", id);
            data.append("newResourceFlag", true);
            data.append("fileListCount", total);
            data.append("fileIndex", i);
            data.append("fileSize", _this.uploadMap.get(id).fileSize);
            data.append("extendName", _this.uploadMap.get(id).extendName);
            data.append("fileType", _this.uploadMap.get(id).fileType);
            data.append("fullName", _this.uploadMap.get(id).fullName);
            data.append("fileDescrip", _this.videos[i].description);
            console.log(_this.videos[i].description);
            //调用ajax post方法上传
            var url = _this.$global.getUrlByAppId("CRE") + '/uploadFiles/' + resourceId + "/file";
            _this.$http({
              url: url,
              method: 'post',
              data: data
              //上传成功回调
            }).then(function(res) {
              let data = res.data;
              sucCnt++;
              if (sucCnt == total) {
                resolve(data);
              }
              //上传失败回调
            }).catch(function(err) {
              console.log(err);
              reject(file);
            });
          })();
        }
      });
    }
  }
}
</script>

<style lang="scss">
.new-video {
  .container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    clear: both;
  }

  .z_photo {
    width: 6.4rem;
    /*height: 8.8rem;*/
    padding-left: 0.1rem;
    overflow: auto;
    clear: both;
    margin: 0 auto;
    /*border: 1px solid #555;*/
  }

  .z_photo .z_addImg img {
    width: 1rem;
    height: 1rem;
    border: 2px solid white;
  }

  .imgborder {
    border: 2px solid firebrick !important;
  }

  .z_addImg {
    float: left;
    margin-right: 0.2rem;
    position: relative;
  }

  .description {
    width: 96%;
    clear: both
  }

  .z_file {
    width: 1rem;
    height: 1rem;
    background: url(../../assets/image/z_add.png) no-repeat;
    background-size: 100% 100%;
    float: left;
    margin-right: 0.2rem;
    border: 2px solid white;
  }

  .z_file input::-webkit-file-upload-button {
    width: 1rem;
    height: 1rem;
    border: none;
    position: absolute;
    outline: 0;
    opacity: 0;
  }

  .z_file input#file {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    vertical-align: middle;
    outline: none;
  }
  .progress {
    width: 75%;
    float: left;
    margin-top: 4.5%;
  }
}
</style>
