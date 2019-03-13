export default function () {
  return {
    gotoDetail: function (item) {
      let ccid = item.ccid;
      let resourceId = item.id;
      window.localStorage.removeItem("detail-operator");//每次跳详情页的时候，将缓存去掉
      if (ccid === '图片产品') {
        router.push('/resourceMobile/imageDetail/' + resourceId + '/detail');
      } else if (ccid === '富文本类') {
        router.push('/resourceMobile/textDetail/' + resourceId + '/detail');
      } else if (ccid === '视频产品' || ccid === '音频产品') {
        router.push('/resourceMobile/videoDetail/' + resourceId + '/detail');
      }
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
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    },

    //按钮的排序，将新建等按钮放到首位（此处将新建等按钮去掉）
    sortPrivilegeButtons: function (privilegeButtons) {
      var sortPrivileges = [];
      for (var i = 0; i < privilegeButtons.length; i++) {
        if (!(privilegeButtons[i].privilegeId.indexOf("TO") > -1) && !(privilegeButtons[i].privilegeId.indexOf("PID_PRODUCT_STATUS_DOWNLOAD") > -1) && !(privilegeButtons[i].privilegeId.indexOf("PID_PRODUCT_STATUS_ASSIGN") > -1)) {
          sortPrivileges.push(privilegeButtons[i]);
        }
      }
      return sortPrivileges;
    }
  }
}
