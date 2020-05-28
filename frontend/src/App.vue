<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
// import jwt from 'jsonwebtoken';
// export default {
//   data () {
//     return {
//       userId : '',
//       isLogin : true
//     }
//   },
//   created () {
//       let tokenValue = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)');
//       if(tokenValue){
//         let decoded = jwt.verify(tokenValue[2],'jjh')//jjh는 시크릿 키 배포시 가려야함
//         if(decoded){
//           this.userId = decoded.id;
//           this.isLogin = true;
//         } else {
//           this.isLogin = false;
//         }
//       } else {
//         this.isLogin = false;
//       }
//   },
//   beforeMount () {
//     if(!this.isLogin){
//       this.$router.push('/');
//     }
//   },
//   methods : {
//     updateIsLogin (isLogin) {
//       if(isLogin){
//         this.isLogin = true
//       } else {
//         this.isLogin = false
//       }
//     }
//   }
// }
</script>
<style>
</style>
