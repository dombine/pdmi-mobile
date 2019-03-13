export default function (manuscriptid) {

  return {
    options: {
      showModuleName: false,
      icons: {
        text: "fa fa-pencil",
        color: "fa fa-paint-brush",
        font: "fa fa-font",
        align: "fa fa-align-justify",
        list: "fa fa-list",
        link: "fa fa-chain",
        unlink: "fa fa-chain-broken",
        tabulation: "fa fa-table",
        image: "fa fa-file-image-o",
        hr: "fa fa-minus",
        eraser: "fa fa-eraser",
        undo: "fa-undo fa",
        "full-screen": "fa fa-arrows-alt",
      },
      // 配置图片模块
      // config image module
      image: {
        // 文件最大体积，单位字节  max file size
        sizeLimit: 512 * 1024,
        // 上传参数,默认把图片转为base64而不上传
        // upload config,default null and convert image to base64
        upload: {
          //url: "http://192.168.8.241/EDITCOM/static/plugins/ueditor/jsp/controller.jsp?action=uploadimage&encode=utf-8&manuscriptid=" + manuscriptid,
          headers: {},
          params: {},
          fieldName: {}
        },
        // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
        // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
        // set null to disable compression
        compress: {
          width: 1600,
          height: 1600,
          quality: 80
        },
        // 响应数据处理,最终返回图片链接
        // handle response data，return image url
        uploadHandler(responseText) {
          //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
          var json = JSON.parse(responseText)
          if (!json.ok) {
            alert(json.msg)
          } else {
            return json.data
          }
        }
      },
      language: "zh-cn",
      // 隐藏不想要显示出来的模块
      hiddenModules: [],
      // 自定义要显示的模块，并控制顺序
      visibleModules: [
        "text",
        "color",
        "font",
        "align",
        "list",
        "image",
        "hr",
        "undo",
        "full-screen",
      ],
    }
  }
}
