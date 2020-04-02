<template>
  <div>
    
  </div>
</template>

<script>
  export default {
    data : {
      isLogin : false,
    },
    created () {
      let value = document.cookie.match('(^|;) ?' + "token" + '=([^;]*)(;|$)');
      console.log(value);
    }
  }
</script>
<style>
</style>
