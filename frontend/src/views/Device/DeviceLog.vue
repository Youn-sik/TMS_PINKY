<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card width="100%">
        <v-card-title>
          단말기 에러 로그
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
                  style="width:5%"
              ></v-text-field>
              </template>
              <v-date-picker v-model="dates" no-title scrollable locale="ko" range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">취소</v-btn>
              <v-btn text color="primary" @click="clickOk">확인</v-btn>
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
          :items-per-page="itemsPerPage"
          :page.sync="page"
          @page-count="pageCount = $event"
          hide-default-footer
          :search="search"
          :items="logs"
          item-key="_id"
          class="elevation-0"
        ></v-data-table>
        <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import axios from 'axios';
  export default {
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    created () {
        axios.get('http://172.16.135.89:3000/glogs?type=error')
          .then((res) => {
            this.origin = res.data
            this.logs = this.origin.filter((i) => {
              return(i.regdate.split(' ')[0] >= this.dates[0] && i.regdate.split(' ')[0] <= this.dates[1])
            });
          })
    },
    methods: {
      clickOk () {
          if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
              this.logs = this.origin.filter( (i) =>{
                  return(i.regdate.split(' ')[0] === this.dates[0])
              } )
          } else {
              if(this.dates[0] > this.dates[1]) {
                  let temp = this.dates[0];
                  this.dates[0] = this.dates[1]
                  this.dates[1] = temp;
              }
              this.logs = this.origin.filter( (i) =>{
                  return(i.regdate.split(' ')[0] >= this.dates[0] && i.regdate.split(' ')[0] <= this.dates[1])
              } )
          }
          this.$refs.menu.save(this.dates)
      },
    },
    data () {
      return {
        logs:[],
        origin:[],
        search:'',
        dates: [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
        menu:false,
        itemsPerPage: 10,
        page: 1,
        pageCount: 0,
        headers: [
          { text: '단말기 명', value: 'stb_id' },
          { text: '단말기 시리얼 넘버', value: 'stb_sn' },
          { text: '날짜', value: 'create_dt',filterable: false},
          { text: '로그 메세지', value: 'log_message'},
        ],
      }
    },
  }
</script>
<style>
</style>