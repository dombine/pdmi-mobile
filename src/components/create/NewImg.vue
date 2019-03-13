<template>
  <div class="new-img">
    <CommonHeader :options="options"></CommonHeader>

    <div class="container">
      <mt-field placeholder="请输入标题" v-model="headline"></mt-field>
      <div class="z_photo">
        <div class="z_file">
          <input type="file" id="file" :value="value" accept="image/*" multiple @change='imgChange'/>
        </div>
        <div class="z_addImg" v-for='(item ,index ) in imgs'>
          <img :src="item.url" @touchstart="touchstart(index)" @touchend="touchend(index)"
               :class="{ imgborder: index==selectItem }">
        </div>
        <div class="description">
          <mt-field placeholder="图片说明" type="textarea" rows="4" v-model="imgdesc"></mt-field>
        </div>
      </div>
    </div>
    <FootButton :catalogue="Catalogue" :save="ImgSave" :commit="ImgCommit"></FootButton>
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
  import {MessageBox, Toast} from 'mint-ui'

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
          title: '新建图片',
          align: 'center',
          topIndex : false
        },
        headline: '',
        imgs: [],
        fileMap: new Map(),
        uploadMap: new Map(),
        value: '',
        starttime: 0,
        selectItem: 0,
        imgdesc: '',
        cancel:null,
        cataloguePopupVisible:false,//编目弹出是否显示
        catalog: {keyWord: '', source: '', creator: ''},//编目信息
        auditPopupVisible:false,//提交审核弹出是否显示
        audit: {departmentId: '', topidId: '', auditorId: ''},//提交审核信息
      }
    },
    watch: {
      imgdesc(curVal) {
        if (this.imgs.length > 0)
          this.imgs[this.selectItem].imgdesc = curVal;
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
      ImgSave: function () {
        this.newResource(false);
      },
      ImgCommit: function () {
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
      newResource: function (auflg) {
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
          var fileName = this.fileMap.get(this.imgs[0].id).name;
          data.fileExtend = fileName.substr(fileName.indexOf('.'));
        }
        //调用创建资源接口
        let url = this.$global.getUrlByAppId("RESOURCEMANAGER") + "/v2/newResource?userId=" + this.$global.userId;
        _this.$http({
          url: url,
          method: "post",
          headers: {'Content-Type': 'text/plain'},
          data: JSON.stringify(data)
        }).then(function (res) {
          let data = res.data;
          let resourceId = data.resourceId;
          //如果选择了本地文件，还需要上传本地文件
          if (localFileCnt > 0) {
            _this.send(data.resourceId)
              .then(function () {
                _this.onCreateSuccess(true, auflg, resourceId);
              }, function () {
                _this.onCreateSuccess(false);
              })
              .catch(function () {
                _this.onCreateSuccess(false);
              });
            //如果没有选择本地文件，直接提示完成
          } else {
            _this.onCreateSuccess(true, auflg, resourceId);
          }
        }).catch(function () {
          _this.onCreateSuccess(false);
        });
      },
      onCreateSuccess: function (flag, auflg, resourceId) {
        if (flag) {
          router.push({ name: 'product', params: { 'refresh': true } });
        } else {
          Toast('创建失败');
        }
      },
      touchstart: function (index) {
        this.starttime = new Date().getTime();
        this.selectItem = index;
        this.imgdesc = this.imgs[index].imgdesc;
      },
      touchend: function (index) {
        let _this=this;
        if (new Date().getTime() - _this.starttime > 500) {
          MessageBox.confirm("确定要删除这张图片吗？").then(action => {
            let id = _this.imgs[index].id;
            //在临时文件夹中删除 add by dongbing
            if (_this.uploadMap.get(id) != null) {
              let url = _this.$global.getUrlByAppId("CRE") + "/uploadFiles/temp/delete";
              _this.$http({
                url:url,
                data: JSON.stringify({"fullName": _this.uploadMap.get(id).fullName})
              }).then(function (res) {
                _this.fileMap.delete(id);
                _this.uploadMap.delete(id);
                _this.imgs.splice(index, 1);
                Toast('删除成功');
              }).catch(function (err) {
                console.log("error:" + err);
                Toast('删除失败！');
              });
            } else {
              _this.cancel();
              _this.imgs.splice(index, 1);
              Toast('删除成功', 'success');
            }
          }).catch(err => {
          });
        }
      },
      imgChange: function (event) {
        let files = event.target.files;
        var rightType=new Array(".gif",".jpg",".png",".jpeg",".bmp",".tif",".psd",".nef",".raf",".cr2",".dng",".pef",".orf",".x3f",".mrw",".crw",".mef",".raw",".orf",".x3f",".sr2",".arw",".psd");
        let flag=this.$global.checkSuffix(files,rightType);
        if(!flag){
          Toast("请上传正确格式!");
          return;
        }
        if (this.headline === "") {
          var fileName = files[0].name;
          this.headline = fileName.substr(0, fileName.indexOf('.'));
        }
        let that = this;
        if (files.size <= 0) return;
        for (let i = 0; i < files.length; i++) {
          //生成uuid作为文件的唯一标识
          let id = that.generateUUId();
          let file = files[i];
          //将文件保存入map中，用于传输
          that.fileMap.set(id, file);
          let img = {};
          img.url = window.URL.createObjectURL(file);
          img.id = id;
          img.description = "";
          that.imgs.push(img);
          if (this.imgs.length == 1)//第一张默认选中
            this.imgdesc = '';
          that.sendToTemp(id)
            .then(function (data) {
              if (data.isSuccess) {
                Toast('上传成功');
              } else {
                Toast('上传失败');
              }
            }, function () {
              Toast('上传失败');
            })
            .catch(function (err) {
              console.log("error:" + err);
            });
          that.value = null;
        }
      },
      sendToTemp: function (id) {
        let _this = this;
        //返回一个promise对象
        return new Promise(function (resolve, reject) {
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
            cancelToken: new CancelToken(function executor(c) {
              _this.cancel = c;
            })
            //上传成功回调
          }).then(function (res) {
            let data = res.data;
            _this.uploadMap.set(data.id, data);//将上传的文件信息记录
            resolve(data);
          }).catch(function (err) {
            console.log("error:" + err);
            reject(file);
          });
        });
      },
      send: function (resourceId) {
        var _this = this;
        //返回一个promise对象
        return new Promise(function (resolve, reject) {
          var total = _this.fileMap.size;
          var sucCnt = 0;
          for (var i = 0; i < _this.imgs.length; i++) {
            (function () {
              var id = _this.imgs[i].id;
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
              data.append("fileDescrip", _this.imgs[i].description);
              //调用ajax post方法上传
              var url = _this.$global.getUrlByAppId("CRE") + '/uploadFiles/' + resourceId + "/file";
              _this.$http({
                url: url,
                method: 'post',
                data: data
                //上传成功回调
              }).then(function (res) {
                let data = res.data;
                sucCnt++;
                if (sucCnt == total) {
                  resolve(data);
                }
                //上传失败回调
              }).catch(function (err) {
                Toast("error:" + err.status);
                reject(file);
              });
            })();
          }
        });
      },
      generateUUId: function (len, radix) {
        let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          // rfc4122, version 4 form
          let r;

          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
      }
    }
  }
</script>

<style lang="scss">
  .new-img{
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
      /*    height: 1rem;*/
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
  }
</style>
