<template>
    <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>출입 통제 시스템</v-toolbar-title>
                <v-spacer />
              
              </v-toolbar>
              <v-card-text>
                <v-form method="post" @submit.prevent="login">
                  <v-text-field
                    label="아이디"
                    name="login"
                    v-model="user_id"
                    type="text"
                  />

                  <v-text-field
                    id="password"
                    label="비밀번호"
                    name="password"
                    v-model="user_pw"
                    type="password"
                  />
                  <v-card-actions>
                  <v-spacer />
                    <v-btn color="primary" type="submit">로그인</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import gql from 'graphql-tag';
export default {
  name: "Home",
  props:["isLogin"],
  data(){
    return{
      user_id: '',
      user_pw: '',
      userData : null,
      token : null,
    }
  },
  apollo: {
    login : {
      query : gql`
        query getUser($user_id:String,$user_pw:String){
          login(user_id:$user_id,user_pw:$user_pw) {
            user_id
          }
        }
      `,
      fetchPolicy: 'no-cache',
      variables () {
        return {
          user_id : this.user_id,
          user_pw : this.user_pw,
        }
      },
      skip() {
        return true;
      },
      result(ApolloQueryResult){
        if(ApolloQueryResult.data.login === null) {
          alert("로그인 실패");
          this.$apollo.queries.login.skip = true;
        } else {
          this.token = ApolloQueryResult.data.login.user_id;
          this.$emit('login',true);
          document.cookie = 'token=' + this.token;
          this.$router.push('/index');
        }
      },
      error(){
        alert("로그인 실패");
        this.$apollo.queries.login.skip = true;
      }
    }
  },
  methods: {
    login () {
      if(this.user_id === '') {
        alert('아이디를 입력해 주세요');
      } else if(this.user_pw === '') {
        alert('비밀번호를 입력해 주세요');
      } else {
        this.$apollo.queries.login.skip = false;
        this.$apollo.queries.login.refetch();
      }
    },
  }
}
</script>

<style>
</style>
