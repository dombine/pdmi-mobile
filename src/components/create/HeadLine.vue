<template>
  <div>
    <div>
      <div v-if="headVisible">
        <mt-field placeholder="引题" v-model="head"></mt-field>
      </div>
      <div>
        <div>
          <v-touch v-on:press="show">
            <mt-field placeholder="请输入标题" v-model="headline"></mt-field>
          </v-touch>
        </div>
        <div>
          <mt-popup class="popup" :modal=false v-model="popupVisible" popup-transition="popup-fade">
            <mt-cell @click.native="showhead" title="添加引题"></mt-cell>
            <mt-cell @click.native="showsubhead" title="添加副标题"></mt-cell>
          </mt-popup>
        </div>
      </div>
      <div v-if="subheadVisible">
        <mt-field placeholder="副标题" v-model="subhead"></mt-field>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      head: '',
      headline: '',
      subhead: '',
      popupVisible: false,
      subheadVisible: false,
      headVisible: false
    }
  },
  methods: {
    show: function() {
      if (this.subheadVisible && this.headVisible) {
        return;
      }
      this.popupVisible = true;
      return false;
    },

    showhead: function() {
      this.headVisible = true;
      this.popupVisible = false;
    },
    showsubhead: function() {
      this.subheadVisible = true;
      this.popupVisible = false;
    }
  }
}
</script>

<style>
.popup {
  background-color: #ffffff;
  border: 1px solid #dedede;
  height: auto;
  width: 150px;
}
</style>
