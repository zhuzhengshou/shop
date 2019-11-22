import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '../views/GoodsList.vue';
import Cart from '../views/Cart.vue';
import Address from '../views/Address.vue';
import OrderConfirm from '../views/OrderConfirm.vue';
import OrderSuccess from '../views/OrderSuccess.vue';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: GoodsList
    },
    {
      path:'/cart',
      component:Cart
    },
    {
      path:'/address',
      component:Address
    },
    {
      path:'/OrderConfirm/:addressId',
      component:OrderConfirm
    },
    {
      path:'/OrderSuccess/:orderId',
      component:OrderSuccess
    }
  ]
})
