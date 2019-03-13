import cookie from './cookie'
import {Toast} from 'mint-ui'

export default function () {

  return {
    userId: cookie().getCookie("userId") || "e18a0f771ac4485fa9107d8382326e57",
    userName: cookie().getCookie("userName") || "黄少明",

    getUrlByAppId: function (appId) {
      return cookie().getCookie(appId) || ("http://192.168.8.196:8090/" + appId);
    },

    getUserId: function () {
      return userId;
    },

    getUserName: function () {
      return userName;
    },

    //时间格式化方法
    dateFormat: function (date, fmt) {
      var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },

    /**
     * 数组的 delete方法，支持针对某一个属性 add by dongbing
     * */
    arrayDelete: function (array, item, attr) {
      var n;
      for (var i = 0; i < array.length; i++) {

        var thisItem = attr ? array[i][attr] : array[i];
        var thatItem = attr ? item[attr] : item;

        if (thisItem == thatItem) {
          n = i;
          break;
        }
      }
      if (n >= 0)
        array.splice(n, 1);
    },
    /**
     * 下划线转驼峰 add by dongbing
     * */
    underline2Camel: function (str) {
      if (!str) return null;
      str = str.toLowerCase();
      var re = /_(\w)/g;
      return str.replace(re, function ($0, $1) {
        return $1.toUpperCase();
      });
    },
    /**
     * 对象深度 copy add by dongbing
     * */
    deepCopy: function (source) {
      var clone = function (obj) {
        var o;
        switch (typeof obj) {
          case 'undefined':
            break;
          case 'string':
            o = obj + '';
            break;
          case 'number':
            o = obj - 0;
            break;
          case 'boolean':
            o = obj;
            break;
          case 'object':
            if (obj === null) {
              o = null;
            } else {
              if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                  o.push(clone(obj[i]));
                }
              } else {
                o = {};
                for (var k in obj) {
                  o[k] = clone(obj[k]);
                }
              }
            }
            break;
          default:
            o = obj;
            break;
        }
        return o;
      }
      return clone(source);
    },

    /**
     * 数组的 contains方法，支持针对某一个属性 add by dongbing
     * */
    arrayContains: function (array, item, attr) {
      if (!array || array.length === 0) return false;
      let result = false;
      for (let i = 0; i < array.length; i++) {

        let thisItem = attr ? array[i][attr] : array[i];
        let thatItem = attr ? item[attr] : item;

        if (thisItem === thatItem) {
          result = true;
          break;
        }
      }
      return result;
    },

    arrayFind: function (array, attr, value) {
      if (!array || array.length === 0) return null;
      let result = null;
      for (let i = 0; i < array.length; i++) {
        let thisItem = array[i][attr];
        if (thisItem === value) {
          result = array[i];
          break;
        }
      }
      return result;
    },

    /**
     * 不添加相同的元素 add by dongbing
     * */
    arrayPushNotExistItem: function (array, item, attr) {
      if (!array) array = [];
      if (!this.arrayContains(array, item, attr)) {
        array.push(item);
      }
    },
    /**
     *  add by chuhongdong
     * */
    checkSuffix: function (files, rightType) {
      /*实际名称的后缀名集合*/
      var nameArr = new Array();
      for (var i = 0; i < files.length; i++) {
        var name = files[i].name;
        nameArr.push((name.substr(name.lastIndexOf("."))).toLowerCase());
      }
      for (var i = 0; i < nameArr.length; i++) {
        if (rightType.indexOf(nameArr[i]) == -1) {
          return false;
        }
      }
      return true;
    }
  }
}
