<template>
  <v-app id="inspire">
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
          <v-btn color="primary" elevation="0" v-on="on">
            <!-- <span>{{userId}}</span> -->
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="px-2">
          <v-list-item @click="clickLogout" class="mx-0 px-8 ">
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
       <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>출입 통제 시스템</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>


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
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
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
    
    <v-content>
        <router-view></router-view>
    </v-content>

    <v-footer
      app
      color="primary"
      class="white--text"
    >
      <span>Vuetify</span>
      <v-spacer />
      <span>&copy; 2019</span>
    </v-footer>
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
    // props:["isLogin","userId"],
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
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: '인사 관리',
          model: false,
          children: [
            // { text: '사원 관리', to: '/employee' },
            { text: ' - 사원 관리', to: '/employeegroup' },
            // { text: '방문자 관리', to: '/visitor' },
            { text: ' - 방문자 관리', to: '/visitorgroup' },
            // { text: '블랙리스트 관리', to: '/blacklist' },
            { text: ' - 블랙리스트 관리', to: '/blacklistgroup' },
            { text: ' - 미등록자 관리', to: '/stranger' },
            { text: ' - 등록 기록', to: '/regrecord' },
            { text: ' - 사진으로 검색', to: '/searchpeople' },
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: '단말 관리',
          model: false,
          children: [
            { text: ' - 단말 목록' ,to: '/device'},
            { text: ' - 단말기 스크린샷' ,to: '/devicescreen'},
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: '출입, 출근 관리',
          model: false,
          children: [
            // { text: '출석 규칙', to:"/attendancerules" },
            // { text: '출석 구역' , to:"/attendancearea"},
            { text: ' - 출입 기록', to:'/attendancerecords' },
            { text: ' - 출근 기록',to:'/AttendanceStatistics' },
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: '시스템 관리',
          model: false,
          children: [
            // { text: '기업 정보' },
            { text: ' - 계정 관리', to:'/account'},
            { text: ' - 작업 기록', to:'/operationlog' },
            // { text: '오픈 플랫폼' },
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: '통계',
          model: false,
          children: [
            // { text: '출석 통계', to:'/'},
            // { text: '출입 통계', to:'/' },
            { text: ' - 단말 통계', to:'/devicereport' },
          ],
        },
      ],
    }),
  }
</script>
