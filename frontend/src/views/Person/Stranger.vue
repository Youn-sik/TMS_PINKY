<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card width="100%">
        <v-data-table
          v-model="userSelected"
          :single-select="true"
          show-select
          item-key="_id"
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
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>


<script> 
  import axios from "axios";
  export default {
    created () {
      axios.get('http://172.16.135.89:3000/access?type=3')
        .then((res) => {
          this.access = res.data
        })
    },
    data: () => ({
      access:[],
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
    }),
  methods: {
    registStrager(item) {
      this.$router.push({name:'AddStranger',params:{item}});
    },
    getFormatDate(date){
        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate();                   //d
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
        return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    },
  },
}
</script>
