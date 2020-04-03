<template>
  <div id="app">
    <Header v-bind:isLogin = "isLogin" v-on:logout="updateIsLogin"></Header>
    <router-view v-bind:isLogin = "isLogin" v-on:login="updateIsLogin"/>
  </div>
</template>
<script>
import Header from './components/Header.vue'
export default {
  components: {
    'Header' : Header
  },
  data () {
    return {
      isLogin : false
    }
  },
  created () {
      let value = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)');
      if(value){
        this.isLogin = true;
      }
  },
  methods : {
    updateIsLogin (isLogin) {
      if(isLogin){
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    }
  }
}
</script>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
