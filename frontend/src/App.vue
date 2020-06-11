<template>
  <div id="app">
    <!-- 토큰이 유효하거나 로그인 페이지 일때만 렌더링 -->
    <router-view v-if="auth === true || $route.path === '/'" />
  </div>
</template>
<script>
import axios from "axios";
export default {
  data () {
    return {
      auth : false,
    }
  },
  beforeUpdate () {
    var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    if(value === null) {
      const path = '/'
      if (this.$route.path !== path) this.$router.push(path)
    } else {
      axios.get('http://172.16.135.89:3000/auth?token='+value[2])
        .then((res) => {
          if(res.data.auth === false) {
            const path = '/'
            if (this.$route.path !== path) this.$router.push(path)
          } else {
            this.auth = true;
          }
        })
    }
  },
}
</script>

