<template>
  <div id="app">
    <Header v-bind:isLogin = "isLogin" v-on:logout="updateIsLogin"></Header>
    <router-view v-bind:isLogin = "isLogin" v-on:login="updateIsLogin"/>
  </div>
</template>
<script>
import Header from './components/Header.vue'
import jwt from 'jsonwebtoken';
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
      let tokenValue = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)');
      if(tokenValue){
        let decoded = jwt.verify(tokenValue[2],'jjh')//jjh는 시크릿 키 배포시 가려야함
        if(decoded){
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      } else {
        this.isLogin = false;
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
