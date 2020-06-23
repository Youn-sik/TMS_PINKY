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
            :items="api_v1_group_group"
            item-key="_id"
            :active.sync="active"
            :search="searchGroup"
            activatable
            :return-object="true"
          >
            <template v-slot:prepend="{ item }">
              <v-icon
                v-if="item.children"
                v-text="`mdi-folder-network`"
              ></v-icon>
              <v-icon
                v-else-if="item.avatar_file"
                v-text="`person`"
              ></v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
      <v-divider vertical></v-divider>
      <v-card width="75%">
          <v-tabs
          v-model="tab">
            <v-tab>그래프</v-tab>
            <v-tab>상세</v-tab>
        </v-tabs>
        <v-divider></v-divider>
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
                style="width:30%"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" no-title scrollable range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="clickOK">OK</v-btn>
            </v-date-picker>
        </v-menu>
        <v-card-text style="height:55%;" v-if="tab === 0">
            <v-row 
                style="height:100%;"
                v-if="!active[0]" 
                align="center"
                justify="center">
                유저를 선택해 주세요
            </v-row>
            <v-row 
                style="height:100%;"
                v-else-if="accessOrigin.length === 0 || personalAccess.length === 0" 
                align="center"
                justify="center">
                데이터가 없습니다
            </v-row>
            <template v-else>
                <v-row align="center" justify="center">
                    <GChart
                        type="PieChart"
                        style="height:40vh; margin:10px 10px;"
                        :data="accessChartData"
                        :options="chartOptions"
                    />
                    <GChart
                        type="PieChart"
                        style="height:40vh; margin:10px 10px;"
                        :data="temperature"
                        :options="tempChartOptions"
                    />
                </v-row>
            </template>
        </v-card-text>
        <v-card-text style="height:55%;" v-else-if="tab === 1">
            <v-row 
                style="height:100%;"
                v-if="!active[0]"
                align="center"
                justify="center">
                유저를 선택해 주세요
            </v-row>
            <v-data-table
            v-else
            :headers="headers"
            :items="personalAccess"
            hide-default-footer
            item-key="_id"
            class="elevation-0">
                <template v-slot:item.avatar_file_url="{ item }">
                    <img 
                    width="70px"
                    class="mt-1 mb-1"
                    :src="item.avatar_file_url"/>
                </template>
                <template v-slot:item.avatar_temperature="{ item }">
                    {{item.avatar_temperature.substring(0,4)}}
                </template>
            </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
  import { GChart } from 'vue-google-charts'
  import axios from "axios";
  export default {
    computed: {
      filteredItems() {
        if(this.searchEmployee === '') {
          return this.api_v1_person_users
        } else {
          return this.api_v1_person_users.filter((i) => {
            return i.name.indexOf(this.searchEmployee) >= 0;
          })
        }
      },
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    components: {
        GChart : GChart
    },
    data () {
        return {
            active:[],
            headers: [
                { text: '', value: 'avatar_file_url' ,sortable: false},
                { text: '온도', value: 'avatar_temperature' },
                { text: '날짜', value: 'access_time' },
            ],
            tab : null,
            api_v1_group_group:[
                {_id:'사원', name:'사원',children:[]},
                {_id:'방문자',name:'방문자',children:[]},
                {_id:'미등록자',name:'미등록자',children:[]},
                {_id:'블랙리스트',name:'블랙리스트',children:[]}
            ],
            accessChartData:[
                ['타입','값'],
                ['정시출근',0],
                ['지각',0]
            ],
            temperature:[
                ['타입', '값'],
                ['정상체온(35℃~37℃)',0],
                ['고체온(38℃ 초과)',0],
                ['저체온(35℃ 미만)',0]
            ],
            chartOptions:{
                legend: {
                    position: 'bottom',
                    scrollArrows: 'none'
                },
                title: '출근 통계',
                pieSliceText:'value',
                chartArea: {'width': '100%', 'height': '80%'},
            },
            tempChartOptions:{
                legend: {
                    position: 'bottom',
                    scrollArrows: 'none'
                },
                title: '온도 통계',
                pieSliceText:'value',
                chartArea: {'width': '100%', 'height': '80%'},
            },
            access:[],
            accessOrigin:[],
            personalAccess:[],
            searchGroup: '',
            menu : false,
            dates: [this.getFormatDate(new Date,-1), this.getFormatDate(new Date,-1)],
        }
    },
    watch : {
      active : function (newVal) {
        if(newVal.length > 0 && newVal[0].children === undefined) {
            this.accessOrigin = this.access.filter((i) => {
                return newVal[0].avatar_contraction_data === i.avatar_contraction_data 
            })
            this.clickOK();
        }
      }
    },
    created () {
        axios.get('http://172.16.135.89:3000/group?')
            .then((res) => {
               res.data.map((i) => {//user_obids에 있는 데이터 children으로 옮기기
                    this.moveUserIds(i);
                })
                let index = res.data.findIndex(i => i.name == "undefined");
                if(index !== -1) {
                    let undefinedGroup = res.data.splice(index,1);
                    res.data.push(undefinedGroup[0]);
                }
                res.data.map((i) => {
                    if(i.type === 1) {
                        this.api_v1_group_group[0].children = [i];
                    } else if(i.type === 2) {
                        this.api_v1_group_group[1].children = [i];
                    } else if(i.type === 3) {
                        this.api_v1_group_group[2].children = [i];
                    } else if(i.type === 4) {
                        this.api_v1_group_group[3].children = [i];
                    }
                })
            })
        axios.get('http://172.16.135.89:3000/access')
            .then((res) => {
                this.access = res.data
            })
    
    },
  methods: {
    clickOK(){
        this.accessChartData = [
            ['타입','값'],
            ['정시출근',0],
            ['지각',0]
        ]
        this.temperature = [
            ['타입', '값'],
            ['정상체온(35℃~37℃)',0],
            ['고체온(37℃ 초과)',0],
            ['저체온(35℃ 미만)',0]
        ]
        if(this.active.length > 0) {
            if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
                this.personalAccess = this.accessOrigin.filter( (i) => {
                    return (i.access_time.split(" ")[0] === this.dates[0])
                })
            } else {
                if(this.dates[0] > this.dates[1]) {
                    let temp = this.dates[0];
                    this.dates[0] = this.dates[1];
                    this.dates[1] = temp;
                }
                this.personalAccess = this.accessOrigin.filter((i) => {
                    if(i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1]) {
                        return true
                    }
                })
            }
            this.personalAccess.map((i) => {
                if(i.access_time.split(' ')[1] > '09:00:00') {
                    this.accessChartData[2][1]++
                } else {
                    this.accessChartData[1][1]++;
                }

                if(i.avatar_temperature > 37) {
                    this.temperature[2][1]++;
                } else if(i.avatar_temperature < 35) {
                    this.temperature[3][1]++;
                } else {
                    this.temperature[1][1]++;
                }
            })
        }
        this.$refs.menu.save(this.dates)
    },
    moveUserIds (data)  {
      if(data.children[0] !== undefined) {
          data.children.map((i) => {
              this.moveUserIds(i)
          })
      }
      if(data.user_obids[0] !== undefined) {
        data.children = data.children.concat(data.user_obids);
      }
    },
    getFormatDate(date){
        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate();                   //d
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        return  year + '-' + month + '-' + day
    },
  },
}
</script>
