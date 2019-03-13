<template>
  <div class="my-popup">
    <!--编目弹窗-->
    <mt-popup v-model="catalogVisible" popup-transition="popup-fade" position="bottom" class="mint-popup-1">
      <div class="set-title">编目信息</div>
      <div class="set-container">
        <div class="set-body">
            <img class="img-left" src="../../assets/image/icon/多人.svg" alt="">
            <div>
              <input disabled="disabled"  type="text" name="" value="" placeholder="无数据" v-model="catalog.creator">
            </div>
        </div>
        <div class="set-body">
            <img class="img-left" src="../../assets/image/source.png" alt="">
            <div>
              <input disabled="disabled" type="text" name="" value="" placeholder="无数据" v-model="catalog.comfrom">
            </div>
        </div>
        <div class="set-body">
            <img class="img-left" src="../../assets/image/word.png" alt="">
            <div>
              <input disabled="disabled" type="text" name="" value="" placeholder="无数据" v-model="catalog.keyword">
            </div>
        </div>
      </div>

    </mt-popup>
    <!--记录弹窗-->
    <mt-popup v-model="recordVisible" popup-transition="popup-fade" position="bottom" class="mint-popup-1">
      <table2 :options="createOperatorOptions()"></table2>
    </mt-popup>

    <!--附件弹窗-->
    <mt-popup v-if="ccid == '富文本类'" v-model="attachmentsVisible" popup-transition="popup-fade" position="bottom"
              class="mint-popup-1">
    </mt-popup>
  </div>
</template>
<script>
  import Table2 from '../common/Table2.vue'
  export default {
    data() {
      return {
        auditVisible: false,
        catalogVisible: false,
        recordVisible: false,
        attachmentsVisible: false,
        auditAdvice: '',
        creator: '',
        keyword: '',
        comfrom:''
      }
    },
    components: {
      Table2
    },
    props: ['resourceId', 'catalog', 'operations', 'attachments', 'ccid'],

    methods: {
      createOperatorOptions : function(){
        return {
          data : this.operations || [],
          width: 600,
          column : [
            {
              props : "operator.uname",
              label : '操作人',
              width : 100
            },
            {
              props : "operateDescribe",
              label : '操作',
              width : 100
            },
            {
              props : "created",
              label : '操作时间',
              width : 200
            },
            {
              props : "detailOperation",
              label : '操作描述',
              width : 200
            }
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
  .my-popup {
    .mint-popup-1 {
      width: 96% !important;
      height: 250px;
    }
    .catalog {
      margin-top: 15%;
    }
    .cata-content {
      height: fit-content;
      text-indent: 0.5em;
      font-size: 20px;
      margin-bottom: 2%;
      margin-top: 5%;
    }
    .mint-popup-1 {
      margin-bottom: 15%;
      font-size: 30px;
      text-indent: 0.6em;
    }
    .advice {
      width: 86%
    }

    .pass {
      position: absolute;
      bottom: 10%;
      left: 20%;
    }
    .back {
      position: absolute;
      bottom: 10%;
      right: 20%;
    }

    div.cell {
      width: fit-content;
    }

    th {
      div.cell {
        padding: 0px;
        height: 24px;
        width: 78px;
        margin-left: -15%;
      }
    }
    td {
      div.cell {
        text-indent: 0em;
      }
    }

    .set-title {
      height: 25px;
      line-height: 25px;
      font-size: 14px;
      padding: 5px 5px 5px 20px;
      background-color: #F6F6F6;
    }
    .set-container {
      border: 1px solid #dedede;
      .last {
        border-bottom: 0px !important;
      }
      .set-body {
        input {
          background-color: white;
        }
        div {
          font-size: 15px;
          height: 30px;
          line-height: 30px;
          padding: 5px;
          border-bottom: 1px solid #dedede;
          margin-left: 30px;
          overflow: hidden;
          white-space: nowrap;
          word-break: break-all;
          text-overflow: ellipsis;
          &:empty:before {
            content: attr(placeholder);
            color: #888;
          }
          input {
            width: 100%;
            height: 100%;
            border: 0px;
            outline: none;
            font-size: 15px;
          }
        }
        .img-left {
          float: left;
          width: 20px;
          height: 20px;
          margin-top: 10px;
          margin-left: 5px;
        }
        .img-right {
          float: right;
          width: 20px;
          height: 20px;
          margin-top: 10px;
          margin-right: 5px;
        }
      }
    }
  }

</style>
