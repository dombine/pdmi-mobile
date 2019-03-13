<template>
  <div>
    <mt-button type="danger" size="small" @click="go_audit">审核
    </mt-button>
    <mt-button type="danger" size="small" @click="turn_audit">转审
    </mt-button>
  </div>
</template>
<script>
export default {
  props: ['resourceId', 'departmentId'],
  methods: {
    go_audit: function() {
      router.push('/resourceMobile/audit/' + this.resourceId);
    },
    turn_audit: function() {
      router.push('/resourceMobile/turn_audit/' + this.resourceId + '/' + this.departmentId);
    }
  }
}
</script>
<style>
</style>
