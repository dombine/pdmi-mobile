<template>
  <div class="custom-select">
    <div class="custom-select-input-div">
      <input type="text" name="" v-model="text" placeholder="请选择数据" @click="optionVisable = !optionVisable" class="select-input">
    </div>
    <transition name="fade">
      <div v-show="optionVisable" class="custom-select-options-div">
        <div v-for="item in options.data" :class="['options',initSelect(item.id)?'active':'']" @click="onSelect(item)" :key="item.id">
          {{item.text}}
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      optionVisable: false,
      id: '',
      text: '',
      data: []
    }
  },
  props: ['options'],
  mounted() {
    this.data = this.options.data;
    this.id = this.options.selected;
    this.text = this.getData(this.id);
  },
  methods: {
    initSelect: function(value) {
      return this.options.selected === value;
    },
    onSelect: function(item) {
      this.id = item.id;
      this.text = item.text;
      //this.options.callback(item);
    },
    getData: function(value) {
      var result = '';
      if (this.data && this.data.length > 0) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].id === value) {
            result = this.data[i].text;
            break;
          }
        }
      }
      return result;
    }
  },
  watch: {
    id: function(val) {
      this.options.id = val;
    },
    text: function(val) {
      this.options.text = val;
    }
  }
}
</script>
<style lang="scss">
.custom-select {
  font-size: 14px;
  .custom-select-input-div {
    position: relative;
  }
  .custom-select-options-div {
    position: absolute;
  }
  input {
    outline: none;
    line-height: 25px;
    padding: 5px;
    width: 300px;
    border: 1px solid #dedede;
  }
  .options {
    text-align: left;
    width: 300px;
    height: 30px;
    line-height: 30px;
    padding: 5px;
    border: 1px solid #dedede;
    border-top: 0px;
  }
  .active {
    background-color: #ef4f4f;
    color: #ffffff;
  }
}
</style>
