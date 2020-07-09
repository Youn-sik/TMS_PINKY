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

          <div v-else style=" width:200px; margin:15px auto;">
            <!-- <v-row 
            style="height:100%;"
            align="center"
            justify="center"> -->
              시리얼 넘버 : {{active[0].serial_number}}<br/>
              위치 : {{active[0].location}}<br/>
              IP : {{active[0].ip}}<br/>
              포트 : {{active[0].port}}<br/>
              버전 : {{active[0].app_version}}<br/>
              <div style="display:flex; width:200%;">
              최대 허용 온도 설정 :
                <integer-plusminus
                      style="margin-left:5px"
                      v-model="temperature_max">
                  {{ temperature_max }}℃
                </integer-plusminus><br/>
              </div>
              <v-btn class="primary mt-2 mr-2" @click="controlTemperature">적용</v-btn>
              <v-btn class="error mt-2">단말 전체 적용</v-btn>
          </div>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
  import axios from "axios";
  import IntegerPlusminus from '../../components/IntegerPlusminus'
  export default {
    components: {
      IntegerPlusminus,
    },
    data () {
        return {
            active:[],
            temperature_max : 40,
            temperature_min : 30,
            searchGroup: '',
            menu : false,
            deviceList : [],
            dates: [this.$moment().subtract(1,'days').format('YYYY-MM-DD'), this.$moment().subtract(1,'days').format('YYYY-MM-DD')],
        }
    },
    methods :{
        controlTemperature () {
          this.$mqtt.publish('/control/temperature/' + this.active[0].serial_number,JSON.stringify({stb_sn : this.active[0].serial_number,temperature_max : this.temperature_max}));
        },
    },
    created () {
      this.$mqtt.on('message', (topic,message) => {
        console.log(topic,new TextDecoder("utf-8").decode(message))
      })
      this.$mqtt.on('connect', () => {
        console.log('mqtt was connected')
      })
       axios.get('http://172.16.135.89:3000/camera')
        .then((res) => {
            this.deviceList = res.data;
        })
    },
}
</script>
<style>
  .int-pm-value{
    width:70px;
    padding:0px;
  }
</style>