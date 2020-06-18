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
                                :options="devicesChartOptions"
                                style="width: 250px; height: 250px;"
                            />
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
                        익일 출입
                    </v-chip>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <GChart
                                type="PieChart"
                                :data="chartData"
                                :options="chartOptions"
                                style="width: 250px; height: 250px;"
                            />
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
                        익일 출입 통제
                    </v-chip>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div align="center">통계</div>
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
                        작일 출석
                    </v-chip>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <GChart
                                type="PieChart"
                                :data="chartData"
                                :options="yesterdayChartOptions"
                                style="width: 250px; height: 250px;"
                            />
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
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { GChart } from 'vue-google-charts'
import axios from 'axios'
export default {
    created () {
        axios.get('http://172.16.135.89:3000/access?type=todayStatistics')
            .then((res) => {
                res.data.map((i) => {
                    this.sum += i.count;
                    if(i._id.type === 1) this.employee = i.count
                    else if(i._id.type === 2) this.visitor = i.count
                    else if(i._id.type === 3) this.stranger = i.count
                    else if(i._id.type === 4) this.blacklist = i.count
                })
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
            })      
    },
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    components: {
        GChart
    },
    methods: {
        // onChartReady (chart) {
        //     let data = [
        //         ["상태",'카운트'],
        //         ['ON',0],
        //         ['OFF',0]
        //     ]
        //     let option = {
        //         title : "단말기 상태 통계",
        //         legend :'none',
        //         pieSliceText:'label',
        //         chartArea: {'width': '100%', 'height': '80%'},
        //         titleTextStyle: {
        //             fontSize: "13",
        //             bold: false,
        //             italic: false
        //         }
        //     }
        //     this.deviceConditionData.map((i) => {
        //         if(i.status === "Y") {
        //             data[1][1]++;
        //         } else {
        //             data[2][1]++;
        //         }
        //     })
        //     chart.draw(data,option)
        // }
    },
    data () {
      return {
        picker: new Date().toISOString().substr(0, 10),
        dates:[],
        nowSelected:"week",
        dayMenu: false,
        sum : 0,
        employee : 0,
        visitor : 0,
        stranger : 0,
        blacklist : 0,
        monthMenu: false,
        weekMenu:false,
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
        chartOptions: {
            legend :'none',
            pieSliceText:'label',
            chartArea: {'width': '100%', 'height': '80%'},
        },
        yesterdayChartOptions: {
            legend :'right',
            pieSliceText:'label',
            chartArea: {'width': '100%', 'height': '80%'},
        },
        devicesChartOptions: {
            title : "단말기 상태 통계",
            legend :'none',
            pieSliceText:'label',
            chartArea: {'width': '100%', 'height': '80%'},
            titleTextStyle: {
                fontSize: "13",
                bold: false,
                italic: false
            }
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