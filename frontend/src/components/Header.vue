<template>
  <div>
    <button v-if="isLogin">로그아웃</button>
  </div>
</template>

<script>
  export default {
    data () {
      return{
        isLogin : false,
      }
    },
    created () {
      let value = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)');
      if(value){
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
    updated () {
      let value = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)');
      if(value){
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    }
  }
</script>
<style>
</style>
