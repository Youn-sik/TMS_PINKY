<template>
  <div class="home">
    <form method="post" @submit.prevent="login">
        아이디 : <input v-model="id" name="id"><br/>
        비밀번호 : <input v-model="password" type="password" name="password">
        <input type="submit" value="login">
    </form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "Home",
  data(){
    return{
      id: '',
      password: '',
      userData : '',
    }
  },
  methods: {
    async login () {
      let user
        try {
          user = await axios.post(
            'http://localhost:3000/graphql', {
            query: `
                {
                  getUser(id:"${this.id}",password:"${this.password}") {
                    id
                    password
                  }
                }
              `
          })
        } catch (err) {
          alert("로그인 실패")
        } finally {
          document.cookie = 'token=' + user.data.data.getUser.id
        }
    }
  }
}
</script>
