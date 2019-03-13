<template>
  <div class="query-tab-bottom-down status-search" :class="[!headerOptions.visiable?'head-hidden':'']">
    <common-header v-if="headerOptions.visiable" :options="headerOptions"></common-header>
    <select2 :options="select2Data()"></select2>
  </div>
</template>
<script>
import CommonHeader from '../common/CommonHeader.vue'
import Select2 from '../common/Select2.vue'

export default {
  components: {
    CommonHeader, Select2
  },
  props: ['opts'],
  data() {
    return {
      headerOptions: {
        visiable: true,
        align: 'center',
        title: '状态筛选',
        styleObject: { 'background-color': '#ffffff', 'color': '#333','border-bottom': '1px solid #dedede' },
        backMethod: this.opts.backMethod
      }
    }
  },
  mounted() {
    if (this.opts.headerOptions)
      $.extend(this.headerOptions, this.opts.headerOptions);
  },
  methods: {
    select2Data: function() {
      return {
        data: this.opts.data,
        selected: this.opts.selected,
        callback: this.opts.callBack
      }
    }
  }
}
</script>
<style>
.query-tab-bottom-down.status-search {
  margin-top: 76px;
  background-color: #ffffff;
  width: 100%;
  border-bottom: 1px solid #dedede;
  border-top: 1px solid #dedede;
}
</style>
