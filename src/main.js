// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import './assets/css/login.css'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll';
import Vuex from 'vuex';
import {currency} from './util/currency'; //价格格式化
Vue.filter('currency',currency);
Vue.config.productionTip = false; //关闭生产环境下的提示
Vue.use(VueLazyload, {
  loading: '/static/loading-svg/loading-bars.svg',
  attempt:1//加载错误后最大尝试次数
  
})
Vue.use(infiniteScroll)
Vue.use(Vuex);
var store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateNickName(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount
    }
  }
})
/* eslint-disable no-new */
global.vm = new Vue({
  el: '#app',
  router,
  store,
  render(c){return c(App)}
})
