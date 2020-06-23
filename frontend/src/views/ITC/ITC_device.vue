<template>
  <v-row justify="center">
    <v-col cols="11" class="d-flex">
      <v-card
        width="25%"
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
      <v-card width="75%">
        <!-- <v-card-text class="text--primary"> -->
          <v-row 
          style="height:100%;"
          v-if="!active[0]"
          align="center"
          justify="center">
            단말기를 선택해 주세요
          </v-row>

          <div v-else style="margin:15px 0;">
            <v-row 
            style="height:100%;"
            align="center"
            justify="center">
              시리얼 넘버 : {{active[0].serial_number}}<br/>
              위치 : {{active[0].location}}<br/>
              IP : {{active[0].ip}}<br/>
              포트 : {{active[0].port}}<br/>
              버전 : {{active[0].app_version}}<br/><br/>
              정상 체온 범위 설정 
            </v-row>
            <div style="display:flex; flex-direction: row; flex-wrap: wrap; text-align: center; width:320px; margin:0 auto">
              최소 :
              <integer-plusminus
                    :min="30"
                    style="margin:0 5px"
                    :max="39"
                    v-model="temperature_min">
                {{ temperature_min }}℃
              </integer-plusminus>
              
              최대 :
              <integer-plusminus
                    :min="31"
                    :max="40"
                    style="margin:0 5px"
                    v-model="temperature_max">
                {{ temperature_max }}℃
              </integer-plusminus><br/>
              <div style="margin:0 auto;">
                <v-btn class="primary mr-5 mt-5">적용</v-btn>
                <v-btn class="error ml-5 mt-5">단말 전체 적용</v-btn>
              </div>
            </div>
          </div>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
  import axios from "axios";
  import { IntegerPlusminus } from 'vue-integer-plusminus'
  export default {
    data () {
        return {
            active:[],
            temperature_max : 40,
            temperature_min : 30,
            searchGroup: '',
            menu : false,
            deviceList : [],
            dates: [this.getFormatDate(new Date,-1), this.getFormatDate(new Date,-1)],
        }
    },
    // watch : {
    //   active : function(newVal) {
        
    //   }
    // },
    components: {
      IntegerPlusminus
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