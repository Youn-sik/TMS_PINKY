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
            <v-list-item-title class="headline mb-1">{{api_v1_person_every_type_users.length}}</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">사원</div>
            <v-list-item-title class="headline mb-1">{{empCnt}}</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">방문자</div>
            <v-list-item-title class="headline mb-1">{{visitCnt}}</v-list-item-title>
          </v-list-item-content>
          <v-divider vertical></v-divider>
          <v-list-item-content>
            <div class="mb-4">블랙리스트</div>
            <v-list-item-title class="headline mb-1">{{blackCnt}}</v-list-item-title>
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
              <v-btn text color="primary" @click="menu = false">취소</v-btn>
              <v-btn text color="primary" @click="clickOK">확인</v-btn>
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
          :items-per-page="itemsPerPage"
          :page.sync="page"
          @page-count="pageCount = $event"
          hide-default-footer
          item-key="_id"
          class="elevation-0"
        >
           <template v-slot:item.avatar_file="{ item }">
            <img 
            width="70px"
            class="mt-1 mb-1"
            :src="item.avatar_file_url"/>
          </template>
          <template v-slot:item.type="{ item }">
            <template v-if="item.type === 1">
              사원
            </template>
            <template v-else-if="item.type === 2">
              방문자
            </template>
            <template v-else-if="item.type === 5">
              블랙리스트
            </template>
            <template v-else-if="item.type === 10">
              삭제됨
            </template>
          </template>
          <template v-slot:item.create_at="{ item }">
            {{item.create_at}}
          </template>
        </v-data-table>
        <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios';
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
        menu : false,
        dates: [this.getFormatDate(new Date(),-1), this.getFormatDate(new Date(),0)],
        search: '',
        empCnt:0,
        visitCnt:0,
        blackCnt:0,
        itemsPerPage: 10,
        page: 1,
        pageCount: 0,
        origin: [],
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
          { text: '행동', value: 'action' },
          { text: '날짜', value: 'create_at' },
        ],
        addUserModal : false,
        batchSettingModal : false,
      }
    },
    methods:{
      clickOK(){
        if(this.dates.length === 1) {
          this.api_v1_person_every_type_users = this.origin.filter((i) => {            
            if(i.create_at.split(' ')[0] === this.dates[0] || (i.update_at !== undefined&& i.update_at.split(' ')[0] === this.dates[0])){
              return i;
            }
          });
        } else {
          if(this.dates[0] > this.dates[1]) {
            let temp = this.dates[0];
            this.dates[0] = this.dates[1];
            this.dates[1] = temp;
          }
          this.api_v1_person_every_type_users = this.origin.filter((i) => {
            if((i.create_at.split(' ')[0] >= this.dates[0] && i.create_at.split(' ')[0] <= this.dates[1]) 
                || (i.update_at !=undefined && (i.update_at.split(' ')[0] >= this.dates[0] && i.update_at.split(' ')[0] <= this.dates[1]))){
              return i;
            }
          });
        }
        this.$refs.menu.save(this.dates)
      },
      getFormatDate(date,val){
        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate()+val;                   //d
        var hours = date.getHours();
        if(hours < 10) {
          hours = '0' + hours;
        }
        var minutes = date.getMinutes();
        if(minutes < 10) {
          minutes = '0' + minutes;
        }
        var seconds = date.getSeconds();
        if(seconds < 10) {
          seconds = '0' + seconds;
        }
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        return  year + '-' + month + '-' + day;
      }
    },
    created () {
      axios.get('http://172.16.135.89:3000/history')
        .then((res) => {
          this.origin = res.data
          this.api_v1_person_every_type_users = this.origin
          this.api_v1_person_every_type_users.map((i) => {
            if(i.type === 1) this.empCnt++;
            else if(i.type === 2) this.visitCnt++;
            else this.blackCnt++;
          })
        })
    }

  }
</script>
<style>
</style>