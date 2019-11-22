<template>
    <div>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{ order.orderId}}</span>
              <span>Order total：{{ order.orderTotal}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    import axios from 'axios'
    axios.defaults.withCredentials = true ;//跨域请求时携带Cookie
    export default{
        data(){
            return{
                order:null
            }
        },
        methods:{
          getOrder(){
            axios({
              methods:'get',
              url:'http://localhost:3000/users/getOrder',
              params:{
                orderId:this.$route.params.orderId
              },
              responseType:'json'
            })
            .then(res=>{
              if(res.data!==''){
                this.order = res.data;
                
              }
            })
            .catch(err=>{
              console.log(err)
            })
          }
        },
        created(){
          this.getOrder();
        }
    }
</script>
