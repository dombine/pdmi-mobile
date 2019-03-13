<template>
  <li>
    <span :class="[initSelect()?'active':'']">
      <i v-if="isFolder" class="icon" :class="[open ? 'folder-open': 'folder']" @click="toggle"></i>
      <i v-if="!isFolder" class="icon file-text"></i>
      <span @click="onSelect()" :class="[model.disabled || options.selectedOrgId == model.id?'disabled':'']">{{ model.text }}</span>
      <i class="icon" :class="[initSelect()?'selected':'']"></i>
    </span>
    <ul v-show="open" v-if="isFolder">
      <tree-menu v-for="item in model.children" :model="item" :options="options" :key="item.id"></tree-menu>
    </ul>
  </li>
</template>
<script>
export default {
  name: 'treeMenu',
  props: ['model', 'options'],
  data() {
    return {
      open: this.model.open,
      selected: this.model.selected
    }
  },
  computed: {
    isFolder: function() {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    onSelect: function() {
      if (this.model.disabled || this.options.selectedOrgId === this.model.id)
        return;
      this.options.selected = this.model.id;
      this.options.callBack(this.model);
    },
    initSelect: function() {
      if (this.options.multiple)
        return this.selected || this.$global.arrayContains(this.options.selected, this.model.id);
      else
        return this.model.id === this.options.selected;
    }
  }
}
</script>
<style lang="scss">
ul {
  list-style: none;
  margin: 0px;
  padding-left: 20px;
}

i.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-top: -3px;
  background-repeat: no-repeat;
  vertical-align: middle;
}

.icon.folder {
  background-image: url(../../assets/image/folder-close.png);
}

.icon.selected {
  float: right;
  margin: 10px 20px 0px 0px;
  background-image: url(../../assets/image/selected.png);
}

.icon.folder-open {
  background-image: url(../../assets/image/folder-open.png);
}

.icon.file-text {
  --background-image: url(/src/assets/file-text.png);
}

.tree-menu {
  >ul {
    padding-left: 0px;
    >li {
      padding-left: 20px;
    }
  }
  li {
    line-height: 40px;
    border-top: 1px solid #dedede;
  }
  >ul>li:first-child {
    border-top: 0px;
  }
  >ul>li:last-child {
    border-bottom: 1px solid #dedede;
  }
}

.tree-menu .active {
  color: red;
}

.tree-menu .disabled {
  color: #888;
}
</style>
