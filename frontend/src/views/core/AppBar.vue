<template>
    <v-app-bar
      app
      clipped-right
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title></v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn color="primary" elevation="0" v-on="on" v-if="isLogin" >
            <span>{{userId}}</span>
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="px-2">
          <v-list-item @click="() => {}" class="mx-0 mb-2 px-8 " >
            <v-list-item-title>마이페이지</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="clickLogout" class="mx-0 mt-2 px-8 ">
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
</template>
<script>
    export default {
        name: 'Appbar',
    }
</script>