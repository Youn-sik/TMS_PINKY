<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import axios from "axios";
export default {
  beforeUpdate () {
    var value = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    if(value === null) {
      const path = '/'
      if (this.$route.path !== path) this.$router.push(path)
    } else {
      axios.get('http://172.16.135.89:4000/token_auth?token='+value[2])
        .then((res) => {
          if(res.data.auth === false) {
            const path = '/'
            if (this.$route.path !== path) this.$router.push(path)
          }
        })
    }
  },
}
</script>
<style>
</style>
