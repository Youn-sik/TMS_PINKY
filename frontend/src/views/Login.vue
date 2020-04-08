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
                <v-toolbar-title>KS Cloud 3.3</v-toolbar-title>
                <v-spacer />
              
              </v-toolbar>
              <v-card-text>
                <v-form method="post" @submit.prevent="login">
                  <v-text-field
                    label="Login"
                    name="login"
                    v-model="id"
                    type="text"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    v-model="password"
                    type="password"
                  />
                  <v-card-actions>
                  <v-spacer />
                    <v-btn color="primary" type="submit">LOGIN</v-btn>
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
        this.$router.push('/index');
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
</style>
