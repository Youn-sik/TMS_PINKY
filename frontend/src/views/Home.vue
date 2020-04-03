<template>
  <div class="home">
    <v-row class="formWrap" align="center">
      <v-form class="loginForm" method="post" @submit.prevent="login">
        <v-text-field
          v-model="id"
          :counter="10"
          label="ID"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :counter="10"
          label="PASSWORD"
          required
          :type="'password'"
        ></v-text-field>
        <v-btn type="submit">LOGIN</v-btn>
      </v-form>
    </v-row>
  </div>
</template>

<script>
import gql from 'graphql-tag';
export default {
  name: "Home",
  props:["isLogin"],
  data(){
    return{
      id: "",
      password: "",
      userData : '',
      token : '',
    }
  },
  apollo: {
    getUser : {
      query : gql`
        query getUser($id:String,$password:String){
          getUser(id:$id,password:$password) {
            id
            password
          }
        }
      `,
      skip() {
        return true;
      },
      variables () {
        return {
          id : this.id,
          password : this.password,
        }
      },
      result(ApolloQueryResult){
        this.token = ApolloQueryResult.data.getUser.id;
        this.$emit('login',true);
        document.cookie = 'token=' + this.token;
        this.$router.push('/welcome');
      },
      error(){
        this.$apollo.queries.getUser.skip = true;
        alert("로그인 실패");
      }
    }
  },
  methods: {
    async login () {
      this.$apollo.queries.getUser.skip = false;
      this.$apollo.queries.getUser.refetch();
    }
  }
}
</script>

<style>
  .loginForm{
    padding: 10px 20px;
    margin:0 auto;
    border-radius:3px;
    box-shadow:3px 3px 3px 3px #999;
  }
</style>
