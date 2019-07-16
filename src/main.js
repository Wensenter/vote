// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import stores from "./store";
import api from './utils/api'
import util from './utils/util';
// import Vconsole from 'vconsole';
import 'lib-flexible';
import 'common/reset.less';
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill();

// let vConsole = new Vconsole();
// Vue.use(vConsole);

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$util = util;
Vue.prototype.$store = stores;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  stores,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to,from,next)=>{
  stores.commit('UPDATE_SHOW_VOTE_SUCCESS', false);
  stores.commit('UPDATE_SHOW_ENROLL_SUCCESS', false);
  next()
})
