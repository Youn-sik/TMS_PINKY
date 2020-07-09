<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card width="100%">
        <v-card-title>
          미등록자 관리
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
            <v-date-picker v-model="dates" no-title scrollable locale="ko" range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">취소</v-btn>
              <v-btn text color="primary" @click="clickOK">확인</v-btn>
            </v-date-picker>
          </v-menu>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          item-key="_id"
          :items-per-page="itemsPerPage"
          :page.sync="page"
          @page-count="pageCount = $event"
          hide-default-footer
          :headers="headers"
          :items="access"
        >
          <template v-slot:item.avatar_file="{ item }">
            <img 
            width="70px"
            class="mt-1 mb-1"
            :src="item.avatar_file_url"/>
          </template>
          <template v-slot:item.created_at="{ item }">
            {{item.created_at}}
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn small color="primary" @click="registStrager(item)">등록</v-btn>
          </template>
          <template v-slot:item.avatar_temperature="{ item }">
            {{item.avatar_temperature.substr(0,4)}}
          </template>
          
        </v-data-table>
        <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
      </v-card>
    </v-col>
  </v-row>
</template>


<script> 
  import axios from "axios";
  export default {
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    created () {
      axios.get('http://172.16.135.89:3000/access?type=3')
        .then((res) => {
          this.access = res.data.filter((i) => {
            res.data = res.data.reverse()
            return(i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1])
          })
          this.originData = res.data;
        })
    },
    data () {
      return {
        access:[],
        itemsPerPage: 10,
        menu : false,
        dates: [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
        page: 1,
        originData : [],
        pageCount: 0,
        headers: [
            {
              text: '',
              align: 'center',
              value: 'avatar_file',
              width : '10%',
              sortable: false,
            },
            { text: '온도', value: 'avatar_temperature',width : '30%' },
            { text: '생성일', value: 'access_time' },
            { text: '동작', value: 'action' ,sortable: false},
          ],
      }
    },
  methods: {
    registStrager(item) {
      this.$router.push({name:'인사/미등록자/추가',params:{item}});
    },
    clickOK () {
        if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
            this.access = this.originData.filter( (i) =>{
                return(i.access_time.split(' ')[0] === this.dates[0])
            } )
        } else {
            if(this.dates[0] > this.dates[1]) {
                let temp = this.dates[0];
                this.dates[0] = this.dates[1]
                this.dates[1] = temp;
            }
            this.access = this.originData.filter( (i) =>{
                return(i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1])
            } )
        }
        this.$refs.menu.save(this.dates)
    },
  },
}
</script>
