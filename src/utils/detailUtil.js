/**
 * Created by Administrator on 2017/9/28.
 */

import glo from './global.js'
import axios from 'axios'

let Global = glo();

export default function () {
  return {

    handleCatalogs: function (catalogs) {
      var catalog = {};
      for (var i = 0; i < catalogs.length; i++) {
        if (catalogs[i].id == '作者') {
          catalog.creator = catalogs[i].value;
        } else if (catalogs[i].id == '关键词') {
          catalog.keyword = catalogs[i].value;
        } else if (catalogs[i].id == '来源') {
          catalog.comfrom = catalogs[i].value;
        }
      }
      return catalog;
    },
    handleDepartmentId : function (catalogs) {
      var departmentId = '';
      for ( var i = 0; i< catalogs.length; i++) {
        if (catalogs[i].id == '机构ID') {
          departmentId = catalogs[i].value;
          break;
        }
      }
     return departmentId;
    },
    loadDetailInfo: function (resourceId,callback) {
      var url = Global.getUrlByAppId("PORTAL") + "/loadDetailInfo/" + resourceId;
      axios.get(url).then(function (response) {
        callback(response.data);
      }).catch(function () {
      })
    },
    loadResDetailData: function (resourceId, userId, callback) {
      var url = Global.getUrlByAppId("PORTAL") + "/loadResourceDetailData?userId=" + userId;
      let para = {};
      para.resourceId = resourceId;
      axios.post(url, qs.stringify({para: JSON.stringify(para)}))
        .then(function (response) {
          callback(response.data);
        })
        .catch(function (response) {
        })
    }
  }
}
