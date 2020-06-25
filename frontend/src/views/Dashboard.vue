<template>
    <div>
        <v-row justify="center">
            <v-col cols="11">
                <v-chip
                    class="mb-2"
                    color="primary"
                    text-color="white"
                    label
                    align="left"
                >
                    <v-icon left>perm_identity</v-icon>
                    오늘의 통계
                </v-chip>
                <v-card
                    outlined
                    elevation="1"
                    align="center"
                >
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="overline mb-3">총합</div>
                            <v-list-item-title class="headline mb-1">{{sum}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-3">사원</div>
                            <v-list-item-title class="headline mb-1">{{employee}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-3">방문자</div>
                            <v-list-item-title class="headline mb-1">{{visitor}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-3">미등록자</div>
                            <v-list-item-title class="headline mb-1">{{stranger}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-3">블랙리스트</div>
                            <v-list-item-title class="headline mb-1">{{blacklist}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="11" class="d-flex justify-center">
                <v-card
                    width = "40%"
                    outlined
                    elevation="1"
                    class = "mr-5"
                    max-height = "340px"
                >
                    <v-chip
                        color="primary"
                        text-color="white"
                        align="left"
                        label
                        pill        
                    >
                        <v-icon left>perm_identity</v-icon>
                        단말기
                    </v-chip>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <GChart
                                type="PieChart"
                                :data="deviceStatus"
                                v-if="deviceStatus[1][1]+deviceStatus[2][1] !== 0"
                                :options="devicesChartOptions"
                                style="width:100%; height: 250px;"
                                :resizeDebounce="1"
                            />
                            <v-row v-else-if="isEmpty[0]" 
                                align="center"
                                justify="center">
                                데이터가 없습니다
                            </v-row>
                        </v-list-item-content>
                        <v-divider vertical class="mr-4"></v-divider>
                        
                        <v-list-item-content>
                            <div class="devicecondition">단말기 상태</div>
                            <v-container
                            style="max-height: 220px"
                            class="overflow-y-auto"
                            >
                            
                                <v-row
                                    justify="center"
                                >
                                
                                    <v-list two-line subheader width="100%">
                                        
                                        <v-list-item
                                            v-for="item in deviceConditionData"
                                            :key="item.title"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item.name"></v-list-item-title>
                                            </v-list-item-content>
                                            <!-- <v-spacer></v-spacer> -->
                                            <v-list-item-content style="text-align: center">
                                                <v-icon v-text="'power'" v-if="item.status === 'Y'"></v-icon>
                                                <v-icon v-text="'power_off'" v-else></v-icon>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-row>
                            </v-container>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card
                    width = "30%"
                    height = "340px"
                    outlined
                    elevation="1"
                >
                    <v-chip
                        color="primary"
                        text-color="white"
                        align="left"
                        label
                        pill
                                        
                    >
                        <v-icon left>perm_identity</v-icon>
                        금일 출입
                    </v-chip>
                    <v-list-item three-line style="height:85%">
                        <v-list-item-content>
                            <GChart
                                type="PieChart"
                                v-if="accessData[1][1]+accessData[2][1]+accessData[3][1]+accessData[4][1] !== 0"
                                :data="accessData"
                                :options="chartOptions"
                                style="width: 250px; height: 250px;"
                            />
                            <v-row 
                                v-else-if="isEmpty[1]" 
                                align="center"
                                justify="center">
                                데이터가 없습니다
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card
                    width = "30%"
                    height = "340px"
                    class = "ml-5"
                    outlined
                    elevation="1"
                >
                    <v-chip
                        color="primary"
                        text-color="white"
                        align="left"
                        label
                        pill
                                        
                    >
                        <v-icon left>perm_identity</v-icon>
                        금일 츌근
                    </v-chip>
                    <v-list-item three-line style="height:85%">
                        <v-list-item-content>
                            <GChart
                                type="PieChart"
                                v-if="attendanceData[1][1] + attendanceData[2][1] !== 0"
                                :data="attendanceData"
                                :options="yesterdayChartOptions"
                                style="width: 250px; height: 250px;"
                            />
                            <v-row 
                                v-else-if="isEmpty[3]" 
                                align="center"
                                justify="center">
                                데이터가 없습니다
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="11" class="d-flex justify-center">
                <v-card
                    width = "30%"
                    height = "340px"
                    outlined
                    elevation="1"
                >
                    <v-chip
                        color="primary"
                        text-color="white"
                        align="left"
                        label
                        pill
                                        
                    >
                        <v-icon left>perm_identity</v-icon>
                        단말기 에러
                    </v-chip>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <v-data-table
                            v-if="glogs.length > 0"
                            :headers="headers"
                            :items="glogs"
                            hide-default-footer
                            item-key="_id"
                            class="elevation-0">
                                <template v-slot:item.log_message="{ item }">
                                    <template v-if="item.log_no === 3">
                                        연결 끊김
                                    </template>
                                    <template v-else-if="item.log_no === 32">
                                        CPU과다 사용
                                    </template>
                                    <template v-else-if="item.log_no === 33">
                                        메모리 과다 사용
                                    </template>
                                </template>
                            </v-data-table>
                            <v-row 
                                v-else-if="isEmpty[2]" 
                                align="center"
                                justify="center">
                                데이터가 없습니다
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
                <v-card
                    width = "70%"
                    height = "340px"
                    class = "ml-5"
                    outlined
                    elevation="1"
                >
                    <v-chip
                        color="primary"
                        text-color="white"
                        align="left"
                        label
                        pill
                                        
                    >
                        <v-icon left>perm_identity</v-icon>
                        온도 경고
                    </v-chip>
                    <!-- <div>
                        <span style="border:1px solid black" v-for="item in temperature" v-bind:key="item._id">
                            <img :src="item.avatar_file_url" width="10%" alt="">
                        </span>
                    </div> -->
                    <v-list-item three-line style="height:85%">
                        <v-list-item-content>
                            <v-data-table
                            :items="temperature"
                            hide-default-footer
                            v-if="temperature.length !== 0"
                            item-key="_id"
                            style="text-align: center"
                            class="elevation-0"
                            >
                                <template v-slot:body="{items}">
                                <tr v-for="item in items" :key="item.name" style="display:inline-block; width:20%; text-align:center;">
                                    <td style="width:100%; height=100px;">
                                        <div style="border:1px solid red; width: 9vw; background:rgba(255, 0, 0, 0.65); padding : 10px 10px 5px 10px; margin-top:5px ">
                                            <div style="width: 100%; height: auto; overflow: hidden">
                                                <img :src="item.avatar_file_url" alt="" onerror="this.src='http://172.16.135.89:3000/image/noImage.png'" style="width: auto; height: 200px;" @click="clickImg(item._id.camera_obids) ">
                                            </div>
                                            <h2 style="text-align: left; color: white;">{{item.avatar_temperature.substring(0,4)}}℃</h2>
                                            <h5 v-if="item.avatar_type === 1" style="text-align: left; color: white;">사원</h5>
                                            <h5 v-else-if="item.avatar_type === 2" style="text-align: left; color: white;">방문자</h5>
                                            <h5 v-else-if="item.avatar_type === 3" style="text-align: left; color: white;">미등록자</h5>
                                            <h5 v-else-if="item.avatar_type === 4" style="text-align: left; color: white;">블랙리스트</h5>
                                            <h4 style="text-align: left; color: white;">{{item.access_time}}</h4>
                                        </div>
                                    </td>
                                </tr>
                                </template>
                            </v-data-table>
                            <v-row 
                                v-else-if="isEmpty[4]" 
                                align="center"
                                justify="center">
                                데이터가 없습니다
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { GChart } from 'vue-google-charts'
import axios from 'axios'
export default {
   created ()  {
       axios.get('http://172.16.135.89:3000/access?type=todayAttendance')
            .then((res) => {
                res.data.map((i) => {
                    if(i.access_time.split(' ')[1] <= '09:00:00') {
                        this.attendanceData[1][1]++;
                    } else {
                        this.attendanceData[2][1]++;
                    }
                })
                if(this.attendanceData[1][1] + this.attendanceData[2][1]  === 0) this.isEmpty[3] = true;
            })
        axios.get('http://172.16.135.89:3000/access?type=todayStatistics')
            .then((res) => {
                res.data.map((i) => {
                    this.accessData[i._id.type][1]=i.count;
                    this.sum += i.count;
                    if(i._id.type === 1) this.employee = i.count
                    else if(i._id.type === 2) this.visitor = i.count
                    else if(i._id.type === 3) this.stranger = i.count
                    else if(i._id.type === 4) this.blacklist = i.count
                })
                if(this.sum === 0) this.isEmpty[1] = true;
            })
        axios.get('http://172.16.135.89:3000/camera')
            .then((res) => {
                this.deviceConditionData = res.data;
                res.data.map((i) => {
                    if(i.status === "Y") {
                        this.deviceStatus[1][1]++;
                    } else {
                        this.deviceStatus[2][1]++;
                    }
                })
                if(res.data.length === 0) this.isEmpty[0] = true;
            })
        axios.get("http://172.16.135.89:3000/access?type=temperature")
            .then((res) => {
                this.temperature = res.data.filter((i) => {
                    if(i.access_time.split(' ')[0] === this.dates) {
                        return i;
                    }
                })
                if(this.temperature.length === 0) this.isEmpty[4] = true;
            })
        axios.get('http://172.16.135.89:3000/glogs?type=error')
            .then((res) => {
                this.glogs = res.data
                if(this.glogs.length === 0) this.isEmpty[2] = true;
            })
    },
    components: {
        GChart
    },
    methods: {
    },
    data () {
      return {
        picker: new Date().toISOString().substr(0, 10),
        dates:this.$moment(new Date).format("YYYY-MM-DD"),
        nowSelected:"week",
        dayMenu: false,
        glogs:[],
        sum : 0,
        isEmpty : [false,false,false,false,false], // 0 : 단말기, 1 : 금일 출입, 2 : 단말기 에러, 3 : 전일 출근, 4 : 온도경고
        employee : 0,
        visitor : 0,
        isLoadingForAccess : false,
        stranger : 0,
        blacklist : 0,
        monthMenu: false,
        weekMenu:false,
        headers: [
          { text: '시리얼넘버', value: 'stb_sn' },
          { text: '로그', value: 'log_message' },
          { text: '날짜', value: 'create_dt' },
        ],
        temperature : [],
        date:["day","week","month"],
        chartData: [
            ['Task', 'Hours per Day'],
            ['Work',     11],
            ['Eat',      2],
            ['Commute',  2],
            ['Watch TV', 2],
            ['Sleep',    7]
        ],
        deviceStatus : [
            ["상태",'카운트'],
            ['ON',0],
            ['OFF',0]
        ],
        accessData : [
            ["타입",'카운트'],
            ['사원',0],
            ['방문자',0],
            ['미등록자',0],
            ['블랙리스트',0]
        ],
        attendanceData : [
            ["타입",'카운트'],
            ['출근',0],
            ['지각',0]
        ],
        chartOptions: {
            legend :'bottom',
            pieSliceText:'value',
            chartArea: {'width': '100%', 'height': '80%'},
        },
        yesterdayChartOptions: {
            legend :'bottom',
            pieSliceText:'value',
            chartArea: {'width': '100%', 'height': '80%'},
        },
        devicesChartOptions: {
            title : "단말기 상태 통계",
            legend :'bottom',
            pieSliceText:'value',
            chartArea: {'width': '100%', 'height': '80%'},
            titleTextStyle: {
                fontSize: "13",
                bold: false,
                italic: false
            },
        },
        deviceConditionData : []
      }
    },
}
</script>
<style>
    .devicecondition{
        margin : 2.5px 10px 0 0;
        text-anchor: start;
        font-family: Arial;
        font-size: 13px;
        stroke: none;
        stroke-width: 0;
        fill: #000000;
        position: relative;
        bottom:13px;
    }
</style>
