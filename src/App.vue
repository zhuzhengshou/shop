<template>
  <div id="app">
    <nav-header v-if="!(/\/OrderSuccess/.test($route.path))"></nav-header>
    <nav-bread v-if="!(/\/OrderSuccess/.test($route.path))">{{ $route.path==="/"?'Goods':$route.path.slice(1,$route.path.indexOf('/',1))}}</nav-bread>
    <router-view/>
    <nav-footer v-if=" !(/\/OrderSuccess/.test($route.path))"></nav-footer>
  </div>
</template>

<script>
  import NavHeader from './components/NavHeader'
  import NavFooter from './components/NavFooter'
  import NavBread from './components/NavBread'
  import axios from 'axios'
  export default {
    name: 'App',
    components:{
      'nav-header':NavHeader,
      'nav-footer':NavFooter,
      'nav-bread' :NavBread,
      'model':Modal
    },
    methods:{  
    },
    computed:{
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
