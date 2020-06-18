<template>
  <v-row justify="center">
    <v-col cols="11">
    </v-col>
    <v-col cols="11" class="d-flex">
      <v-card
        width="35%"
      >
        <v-card-title>
          <v-text-field
            v-model="search"
            label="검색"
            clearable
            hide-details
            clear-icon="mdi-close-circle-outline"
            append-icon="search"
          ></v-text-field>
          <div>
          </div>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="api_v3_device_camera"
          :single-select="true"
          @click:row="rowClick"
          item-key="_id"
          class="elevation-0"
        >
        </v-data-table>
      </v-card>
      <v-divider vertical></v-divider>
      <v-card width="65%">
        <v-card-title 
            class="pb-0"
        >
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
              <v-btn text color="primary" @click="clickOK">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-card-title>
        <v-tabs
          v-model="tab"
        >
          <v-tab
            v-for="i in tabs"
            :key="i"
          >
            {{i}}
          </v-tab>
        </v-tabs>
        <!-- <v-tabs-items v-model="tab"> -->
          <!-- <v-tab-item
            v-for="i in tabs"
            :key="i"
            :transition="false" :reverse-transition="false"
          > -->
            <v-card flat v-if="deviceSelected === null" style="text-align: center; margin:100px 0px">
              단말기를 선택해 주세요.
            </v-card>
            <v-card flat v-else-if="isEmpty" style="text-align: center; margin:100px 0px">
              데이터가 없습니다.
            </v-card>
            <v-card flat v-else-if="tab === 0">
              <v-card-text>
                <GChart
                  v-if="chartDates[0] === chartDates[1] || chartDates[1] === undefined"
                  type="PieChart"
                  style="height:40vh; margin:10px 0px;"
                  :data="todayChartData"
                  :options="todayChartOptions"
                />
                <GChart
                  v-else
                  type="LineChart"
                  style="height:40vh; margin:10px 0px;"
                  :data="chartData"
                  :options="chartOptions"
                />
              </v-card-text>
            </v-card>
            <v-card flat v-else-if="tab === 1">
              <v-card-text>
                <GChart
                  v-if="chartDates[0] === chartDates[1] || chartDates[1] === undefined"
                  type="PieChart"
                  style="height:40vh; margin:10px 0px;"
                  :data="todayDeviceChartData"
                  :options="todayChartOptions"
                />
                <GChart
                  v-else
                  type="LineChart"
                  style="height:40vh; margin:10px 0px;"
                  :data="deviceChartData"
                  :options="chartOptions"
                />
              </v-card-text>
            </v-card>
          <!-- </v-tab-item>
        </v-tabs-items> -->
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import { GChart } from 'vue-google-charts'
  import axios from 'axios';
  export default {
    created () {
      axios.get('http://172.16.135.89:3000/camera').then((res) => {
        this.api_v3_device_camera = res.data;
      })
      axios.get('http://172.16.135.89:3000/glogs?type=errer').then((res) => {
        this.glogs = res.data;
      })
    },
    watch: {
      deviceSelected () {
        this.isEmpty = true;
        this.todayDeviceChartData = [
          ['type', 'count'],
          ['CPU 과다 사용',     0],
          ['메모리 과다 사용',      0],
          ['연결 끊김',  0],
        ]

        let temp = this.glogs.filter(i => i.stb_sn === this.deviceSelected && i.regdate.split(' ')[0]=== this.dates[0])
        if(temp.length !== 0) {
          this.isEmpty=false;
        } else {
          return false;
        }
        temp.map((i) => {
          if(i.log_no === 3) {
            this.todayDeviceChartData[3][1]++;
          } else if(i.log_no === 32) {
            this.todayDeviceChartData[1][1]++;
          } else if(i.log_no === 33) {
            this.todayDeviceChartData[2][1]++;
          }
        })
      },
    },
    components: {
        GChart : GChart
    },
    methods: {
      clickOK(){
        this.todayDeviceChartData = [
          ['type', 'count'],
          ['CPU 과다 사용',     0],
          ['메모리 과다 사용',      0],
          ['연결 끊김',  0],
        ]

        if(this.dates.length === 1) {
          this.glogs.map((i) => {
            if(i.stb_sn === this.deviceSelected && i.regdate.split(' ')[0] === this.dates[0]){
              this.isEmpty = false;
              if(i.log_no === 3) {
                this.todayDeviceChartData[3][1]++;
              } else if(i.log_no === 32) {
                this.todayDeviceChartData[1][1]++;
              } else if(i.log_no === 33) {
                this.todayDeviceChartData[2][1]++;
              } else {
                this.isEmpty = true;
              }
            }
          });
        } else {
          if(this.dates[0] > this.dates[1]) {
            let temp = this.dates[0];
            this.dates[0] = this.dates[1];
            this.dates[1] = temp;
          }

          let start_date = this.dates[0].split('-');
          let end_date = this.dates[1].split('-');
          start_date = new Date(start_date[0],Number(start_date[1])-1,start_date[2])       
          end_date = new Date(end_date[0],Number(end_date[1])-1,end_date[2])
          let between_date = (end_date.getTime() - start_date.getTime())/1000/60/60/24;


          this.deviceChartData = [['date', 'CPU 과다 사용', '메모리 과다 사용', '연결 끊김']]
          for(let i = 0; i <= between_date; i++) {
            this.deviceChartData.push([this.$moment(start_date).add(i, 'days').format('YYYY-MM-DD'),0,0,0]);
          }
          this.glogs.map((i) => {
            if(i.stb_sn === this.deviceSelected && i.regdate.split(' ')[0] >= this.dates[0] && i.regdate.split(' ')[0] <= this.dates[1]){
              let i_date = i.regdate.split(' ')[0];
              i_date = i_date.split('-')
              i_date =  new Date(i_date[0],Number(i_date[1])-1,i_date[2])
              let between_i_date = (end_date.getTime() - i_date.getTime())/1000/60/60/24;
              let index = between_date - between_i_date +1;
              this.isEmpty = false;
              if(i.log_no === 3) {
                this.deviceChartData[index][3]++
              } else if(i.log_no === 32) {
                this.deviceChartData[index][1]++;
              } else if(i.log_no === 33) {
                this.deviceChartData[index][2]++;
              } else {
                this.isEmpty = true;
              }
            }
          });
        }
        this.chartDates = this.dates
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
      },
      rowClick: function (item, row) {
        row.isSelected ? row.select(false) : row.select(true);
        this.deviceSelected = item.serial_number;
      },
    },
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    data () {
      return {
        glogs : [],
        isEmpty : true,
        tabs : ['방문자 통계','단말기 통계'],
        tab : null,
        originChartData: [
          ['type', 'count'],
          ['CPU 과다 사용',     0],
          ['메모리 과다 사용',      0],
          ['연결 끊김',  0],
        ],
        menu : false,
        dates: [this.getFormatDate(new Date(),-1), this.getFormatDate(new Date(),-1)],
        chartDates:[this.getFormatDate(new Date(),-1), this.getFormatDate(new Date(),-1)],
        todayChartOptions: {
          legend: {
              position: 'bottom',
              scrollArrows: 'none'
          },
          pieSliceText:'value',
          chartArea: {'width': '100%', 'height': '80%'},
        },
        todayDeviceChartData : [
          ['type', 'count'],
          ['CPU 과다 사용',     11],
          ['메모리 과다 사용',      2],
          ['연결 끊김',  2],
        ],
        deviceChartData: [
          ['date', 'CPU 과다 사용', '메모리 과다 사용', '연결 끊김'],
        ],
        api_v3_device_camera : [],
        todayChartData: [
            ['type', 'count'],
            ['사원',     11],
            ['방문자',      2],
            ['블랙리스트',  2],
            ['미등록자', 2]
        ],
        chartData: [
          ['date', '사원', '방문자', '블랙리스트','미등록자'],
          ['2020-06-08', 10, 4, 2,1],
          ['2020-06-09', 11, 4, 2,10],
          ['2020-06-10', 6, 1, 3,1],
        ],
        chartOptions: {
          chart: {
            title: '방문자 통계',
          },
          legend: {
              position: 'bottom',
              scrollArrows: 'none'
          },
          pieSliceText:'value',
          chartArea: {'width': '100%', 'height': '80%'},
        },
        search: '',
        deviceSelected : null,
        headers: [
          { text: '단말기 명', value: 'name' },
          { text: '시리얼 넘버', value: 'serial_number' },
          { text: '위치', value: 'location' },
        ],
      }
    },
  }
</script>
<style>
  tr.v-data-table__selected {
    color: #1976d2 !important;
    caret-color: #1976d2 !important;
  }
  svg > g > g:last-child { pointer-events: none }
</style>