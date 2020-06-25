<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card
        width="25%"
        class="mr-5 elevation-1"
      >
         <v-card-title>
          <v-text-field
            v-model="searchGroup"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
            style="width:30%;"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-treeview
            :items="deviceList"
            item-key="_id"
            :active.sync="active"
            :search="searchGroup"
            activatable
            :return-object="true"
          >
            <template v-slot:prepend="{ item }">
              <v-icon
                v-if="!item.children"
                v-text="`dns`"
              ></v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
      <v-divider vertical></v-divider>
      <v-card width="75%" class="elevation-1">
        <!-- <v-card-text class="text--primary"> -->
        <v-row 
        style="height:100%;"
        v-if="!active[0]"
        align="center"
        justify="center">
        단말기를 선택해 주세요
        </v-row>
        <template v-else>
            <v-data-table
                :headers="headers"
                :items-per-page="itemsPerPage"
                :page.sync="page"
                @page-count="pageCount = $event"
                hide-default-footer
                :items="accessData"
                class="ml-2 mr-2 elevation-0"
            >
                <template v-slot:item.avatar_file_url="{ item }">
                    <img 
                    width="70px"
                    class="mt-1 mb-1"
                    :src="item.avatar_file_url"/>
                </template>
                <template v-slot:item.avatar_type="{ item }">
                    <template v-if="item.avatar_type===1">사원</template>
                    <template v-else-if="item.avatar_type===2">방문자</template>
                    <template v-else-if="item.avatar_type===3">미등록자</template>
                    <template v-else-if="item.avatar_type===4">블랙리스트</template>
                </template>
                <template v-slot:item.avatar_temperature="{ item }">
                    {{item.avatar_temperature.substring(0,4)}}
                </template>
                <template v-slot:item.user_obid="{ item }">
                    <template v-if="item.user_obid">
                        {{item.user_obid.name}}
                    </template>
                </template>
            </v-data-table>
            <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
  import axios from "axios";
  export default {
    data () {
        return {
            active:[],
            temperature_max : 40,
            temperature_min : 30,
            searchGroup: '',
            menu : false,
            deviceList : [],
            access : [],
            itemsPerPage: 10,
            page: 1,
            pageCount: 0,
            headers: [
                { text: '', value: 'avatar_file_url' },
                {
                    text: '타입',
                    align: 'start',
                    value: 'avatar_type',
                },
                { text: '온도', value: 'avatar_temperature' },
                { text: '출입시간', value: 'access_time' },
            ],
            dates: [this.getFormatDate(new Date,-1), this.getFormatDate(new Date,-1)],
        }
    },
    methods :{
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
      },
    },
    created () {
       axios.get('http://172.16.135.89:3000/camera')
        .then((res) => {
            this.deviceList = res.data;
        })
        axios.get('http://172.16.135.89:3000/access')
        .then((res) => {
            this.access = res.data;
        })
    },
    computed: {
        accessData () {
            return this.access.filter(i => i.stb_sn === this.active[0].serial_number)
        },
    },
}
</script>
<style>
  .int-pm .int-pm-btn[data-v-f3939500] {
    border: 1px solid #CCC;
    background-color: #DDD;
    cursor: pointer;
    padding: 1px 10px;
  }
</style>