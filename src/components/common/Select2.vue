<template>
  <div class="select2">
    <div v-for="item in options.data" :class="['options',initSelect(item.id)?'active':'']" @click="onSelect(item)" :key="item.id">
      {{item.name}}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ['options'],
  methods: {
    initSelect: function(value) {
      return this.options.selected === value;
    },
    onSelect: function(value) {
      this.options.callback(value);
    }
  }
}
</script>
<style lang="scss">
.select2 {
  .options {
    text-align: center;
    height: 30px;
    line-height: 30px;
    padding: 5px;
    border-bottom: 1px solid #dedede;
  }
  .active {
    color: #ef4f4f;
  }
}
</style>
