<template>
  <v-app id="inspire">
    <v-app-bar
      :clipped-left="true"
      app
      color="primary"
      class='elevation-0'
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        @click="$router.push('/index')"
        style="width: 300px; cursor: pointer"
        class="ml-0 pl-4"
      >출입통제 시스템</v-toolbar-title>
      <v-spacer />
      {{$route.name}}
      <v-menu
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn color="primary" elevation="0" v-on="on">
            <!-- <span>{{userId}}</span> -->
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="px-2">
          <v-list-item @click="$router.push('/index/system/account')" class="mx-0 px-8 ">
            <v-list-item-title>계정관리</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="clickLogout" class="mx-0 px-8 ">
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :clipped="true"
      app
    >
     <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
          >
            <template v-slot:activator>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="{path: '/index'+child.to}"
              link
            >
              <v-list-item-content>
                <v-list-item-title class="ml-12 pl-2">
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :to="{path: '/index'+item.to}"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    
    <v-content style="background-color:#fafafa">
        <router-view :user_id="user_id"></router-view>
    </v-content>

    <!-- <v-footer
      app
      color="primary"
      class="white--text"
    >
      <span>Vuetify</span>
      <v-spacer />
      <span>&copy; 2019</span>
    </v-footer> -->
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      drawerRight: null,
      right: false,
      left: false,
    }),
  }
</script>


<script>
    export default {
    props:["isLogin","user_id"],
    methods: {
      clickLogout () {
        this.$emit('logout',false);
        document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
        this.$router.push('/');
      },
    },
    data: () => ({
      dialog: false,
      drawer: false,
      items: [
        { icon: 'trending_up', text: '종합 현황판', to: '/dashboard'},
        {
          icon: 'compare_arrows',
          text: '출입, 출근 관리',
          children: [
            { text: '출입 기록', to:'/access/records' },
            { text: '출근 기록',to:'/access/statistics' },
          ],
        },
        {
          icon: 'people_alt',
          'icon-alt': 'mdi-chevron-down',
          text: '인사 관리',
          model: false,
          children: [
            // { text: '사원 관리', to: '/employee' },
            { text: '사원 관리', to: '/people/employee' },
            // { text: '방문자 관리', to: '/visitor' },
            { text: '방문자 관리', to: '/people/visitor' },
            // { text: '블랙리스트 관리', to: '/blacklist' },
            { text: '블랙리스트 관리', to: '/people/blacklist' },
            { text: '미등록자 관리', to: '/people/stranger' },
            { text: '등록 기록', to: '/people/regrecord' },
            { text: '사진으로 검색', to: '/people/search' },
          ],
        },
        {
          icon: 'dns',
          'icon-alt': 'mdi-chevron-down',
          text: '단말 관리',
          model: false,
          children: [
            { text: '단말기 목록' ,to: '/device/list'},
            { text: '단말기 에러 로그' ,to: '/device/log'},
            { text: '단말기 스크린샷' ,to: '/device/screen'},
          ],
        },
        {
          icon: 'settings',
          'icon-alt': 'mdi-chevron-down',
          text: '시스템 관리',
          model: false,
          children: [
            // { text: '기업 정보' },
            { text: '계정 관리', to:'/system/account'},
            { text: '작업 기록', to:'/system/log' },
            // { text: '오픈 플랫폼' },
          ],
        },
        {
          icon: 'insert_chart',
          'icon-alt': 'mdi-chevron-down',
          text: '통계',
          model: false,
          children: [
            // { text: '출석 통계', to:'/'},
            // { text: '출입 통계', to:'/' },
            { text: '단말 통계', to:'/report/device' },
            { text: '출입 통계', to:'/report/access' },
          ],
        },
        {
          icon: 'camera',
          'icon-alt': 'mdi-chevron-down',
          text: '열화상',
          model: false,
          children: [
            { text: '열화상 단말', to:'/itc/device' },
            { text: '열화상 기록', to:'/itc/records' },
          ],
        },
      ],
    }),
  }
</script>

<style>
    tr.v-data-table__selected {
      color: #1976d2 !important;
      caret-color: #1976d2 !important;
    }
    svg > g > g:last-child { pointer-events: none }
</style>