<template>
  <div>
    <common-header :options="options"></common-header>
    <item name="aaa"></item>
  </div>
</template>

<script>
import Item from '@/components/verify/item'
import CommonHeader from '@/components/common/CommonHeader'

export default {
  components: { Item, CommonHeader },
  data() {
    return {
      options: {
        title: '设置',
        align: 'left'
      }
    }
  }
}
</script>

<style>

</style>
