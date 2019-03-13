// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
import VueTouch from 'vue-touch'
import axios from 'axios'
//import ElementUI from 'element-ui';
import qs from 'qs'
import $ from 'jquery'

import App from './App.vue'
import router from './router/router'
import global from './utils/global'
import renderAxios from './router/axios.js'

//import 'element-theme-default/lib/index.css'
import 'mint-ui/lib/style.css'

renderAxios(axios);

Object.defineProperty(Vue.prototype, "$http", {value: axios});
Object.defineProperty(Vue.prototype, "$global", {value: global()});
window.qs = qs;
window.$jq = $;

Vue.use(MintUI);
Vue.use(VueTouch, {name: 'v-touch'});
//Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
