<template>
  <div>
    <mt-button>
      <i></i> {{ name }}
      <i class="icon"></i>
    </mt-button>
  </div>
</template>

<script>
import MtButton from "../../../node_modules/mint-ui/packages/button/src/button";
export default {
  components: { MtButton },
  data() {
    return {
    }
  },
  props: ['name']
}

</script>

<style>
.icon {
  background: url("./../../assets/image/folder.png");
}
</style>
