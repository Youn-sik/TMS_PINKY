<template>
  <div class="navWrap">
    <button v-if="isLogin" @click="clickLogout">로그아웃</button>
    <button v-else @click="clickLogin">로그인</button>
  </div>
</template>

<script>
  export default {
    props:["isLogin"],
    methods: {
      clickLogout () {
        this.$emit('logout',false);
        document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
        this.$router.push('/');
      },
      clickLogin () {
        this.$router.push('/');
      }
    }
  }
</script>
<style>
  .navWrap{
    background-color: #3282b8;
    margin : 0px 0px 50px 0px;
    color : white;
    overflow: hidden;
  }
  
  .navWrap button {
    float: right;
    padding : 10px;
  }
</style>
