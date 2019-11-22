<template>
    <div>
     <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default " :class="{'cur':!isSort}" @click="changeDefault">Default</a>
            <a href="javascript:void(0)" class="price" :class="{'cur':isSort,'sort-up':sortType=='asc'}" @click="changeSort">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="filterShow=true;isMask=true">Filter by</a>
          </div>
          <div class="accessory-result">
            
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterShow}" >
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='All'}" @click="changeFilter('All')">All</a></dd>
                <dd v-for="(item ,i) in priceFilter" :key="i">
                  <a href="javascript:void(0)"  :class="{'cur':priceChecked==i}" @click="changeFilter(i)">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul >
                  <li  v-for="(item , i) in goodslist" :key="i">
                    <div class="pic">
                      <a href="javascript:void(0)"><img v-lazy="'static/'+item.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice | currency('￥')}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="pushCart(item._id)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20"
                   >
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal :mdShow="needLogin" @closeMd="closeMd">
          <p slot="message">
             请先登录,否则无法加入到购物车中!
          </p>
          <div slot="btnGroup">
              <a class="btn btn--m" href="javascript:;" @click="closeMd">关闭</a>
          </div>
      </modal>
      <modal v-bind:mdShow="addCartYes" @closeMd="closeMd">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="closeMd">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal> 
      <div class="md-overlay" v-show="isMask" @click="isMask=false;filterShow=false"></div>
     
    </div> 
</template>
<script>
    import Modal from './../components/Modal'
    import axios from 'axios';
    axios.defaults.withCredentials = true;
    export default{
      data(){
        return {
          goodslist:[],
          priceChecked:'All',
          filterShow:false,
          isMask:false,
          isSort:false,
          sortType:'desc',
          pageNum:1,
          pageSize:8,
          busy: false,
          loading:false,
          canGetGoods:true,
          needLogin:false,
          addCartYes:false,
          priceFilter:[
                  {
                      startPrice:'0.00',
                      endPrice:'100.00'
                  },
                  {
                    startPrice:'100.00',
                    endPrice:'500.00'
                  },
                  {
                    startPrice:'500.00',
                    endPrice:'1000.00'
                  },
                  {
                    startPrice:'1000.00',
                    endPrice:'5000.00'
                  }
                ],
        }
      },
      components:{
        Modal
      },
      methods:{
        getGoods(){
          axios({
            method:'get',
            url:'http://localhost:3000/goods/list',
            params:{
              isSort:this.isSort,
              sortType:this.sortType,
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              priceRange:this.priceChecked
            },
            responseType:'json'
          }).then((res)=>{
            if(this.pageNum ===1){
                this.goodslist = res.data
            }else{
                this.goodslist = this.goodslist.concat(res.data);
            }
            if(res.data.length < 8 ){
              this.canGetGoods = false;
            }
            this.busy = this.loading = false;
            
          }).catch((err)=>{
            console.log(err)
          })
        },
        reset(){
          //切换价格区间以及排序方法时都会重置页数以及重新设置为可以进行加载
          this.pageNum = 1;
          this.loading = true;
          this.canGetGoods = true;
        },
        changeDefault(){
          //取消排序方法
          this.isSort = false;
          this.reset();
          this.getGoods();
        },
        changeSort(){
          //先判断是否正处在排序状态下，避免从Default切换到价格排序时，排序的方式会发生改变
          if(this.isSort==true){
            this.sortType=this.sortType=='desc'?'asc':'desc'
          }
          this.isSort = true;
          this.goodslist=[];
          this.reset();
          this.getGoods();
        },
        changeFilter(range){
          this.priceChecked=range;
          this.pageNum=1;
          this.reset();
          this.getGoods();
        },
        loadMore(){
          if(this.canGetGoods){
            this.busy = this.loading = true;
            this.pageNum ++;
            setTimeout(() => {
              this.getGoods();
            }, 1000);
          }
        },
        pushCart(id){
          //FormData提供了表单格式数据的构造方式
          var body = new URLSearchParams();
          body.append('id',id);
          axios({
            method:'post',
            url:'http://localhost:3000/goods/addCart',
            data:body,
            responseType:'json'
          }).then((res)=>{
            //未登录用户，被拦截
            if(res.data ===''){
              this.needLogin = true;
            }else{
              this.addCartYes = true;
              this.$store.commit('updateCartCount',1);
            }
            
          }).catch((err)=>{
            console.log(err)
          })
        },
        closeMd(){
          this.needLogin = false;
          this.addCartYes = false;
        }
      },
      created(){
        this.getGoods()
      }
    }
</script>
