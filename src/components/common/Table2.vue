<template>
  <div class="table2" :class="options.className">
    <table :width="options.width">
      <thead>
      <td v-for="col in options.column" :width="col.width">{{col.label}}</td>
      </thead>
      <tr v-for="item in options.data">
        <td v-for="col in options.column" :width="col.width">{{columnValue(item, col)}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Table2',
    data() {
      return {}
    },
    props: ['options'],
    mounted() {

    },
    methods: {
      columnValue: function (item, col) {
        let propsName = col.props;
        let subName = propsName.split('\.');
        let fun = "item";
        for (let i = 0; i < subName.length; i++) {
          fun += "[subName[" + i + "]]";
        }
        return eval(fun);
      }
    }
  }
</script>
<style lang="scss">
  .table2 {
    font-size: 14px;
    text-indent: 0;
    height: 100%;
    width: 100%;
    overflow: auto;
    table {
      border-collapse: collapse;
      td {
        border: 1px solid #dedede;
        padding: 5px;
        text-align: center;
      }
      thead > td {
        font-weight: bold;
      }
    }
  }
</style>
