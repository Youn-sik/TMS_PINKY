<template>
  <v-row justify="center">
    <v-col cols="11">
      <v-card
        outlined
        elevation="1"
        align="center"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="mb-4">총합</div>
            <v-list-item-title class="headline mb-1">3</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">사원</div>
            <v-list-item-title class="headline mb-1">2</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">방문자</div>
            <v-list-item-title class="headline mb-1">1</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">블랙리스트</div>
            <v-list-item-title class="headline mb-1">0</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="11">
      <v-card>
        <v-card-title>
          등록 기록
          <v-spacer></v-spacer>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateRangeText"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" no-title scrollable range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="검색"
            single-line
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          item-key="_id"
          class="elevation-1"
          :custom-filter="customFilter"
        >
           <template v-slot:item.avatar_file="{ item }">
            <img 
            width="70px"
            class="mt-1 mb-1"
            :src="'data:image/jpeg;base64,'+item.avatar_file"/>
          </template>
          <template v-slot:item.type="{ item }">
            <template v-if="item.type === 1">
              사원
            </template>
            <template v-else-if="item.type === 2">
              방문자
            </template>
            <template v-else>
              블랙리스트
            </template>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{item.created_at}}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import EVERY_TYPE_USERS from "../../../grahpql/everyTypeUsers.gql";
  export default {
    computed: {
      filteredItems() {
        if(this.search === '') {
          return this.api_v1_person_every_type_users
        } else {
          return this.api_v1_person_every_type_users.filter((i) => {
            return i.name.indexOf(this.search) >= 0;
          })
        }
      },
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    data () {
      return {
        mene : false,
        dates: ['2019-09-10', '2019-09-20'],
        search: '',
        selected: [],
        api_v1_person_every_type_users:[],
        headers: [
          {
            align: 'center',
            sortable: false,
            value: 'avatar_file',
            width : '10%',
          },
          { text: '이름', value: 'name' },
          { text: '타입', value: 'type' },
          { text: '등록 일자', value: 'created_at' },
          { text: '수정 일자', value: 'updated_at' },
        ],
        addUserModal : false,
        batchSettingModal : false,
      }
    },
    methods:{
      customFilter(items, search, filter) {
        // console.log(items+"\n");
        // console.log(search+'\n');
        search
        items
        console.log(filter+'\n');
        console.log('\n')
        // return 
        // items.map(row => console.log(row));
      }
    },
    apollo: {
        api_v1_person_every_type_users : {
        query : EVERY_TYPE_USERS,
        error (err) {
          if(err.message.split(':')[2] === ' "유효 하지 않는 토큰 입니다"') {
            document.cookie = 'token=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
            this.$router.push('/');
          }
        }
      }
    },
  }
</script>
<style>
</style>