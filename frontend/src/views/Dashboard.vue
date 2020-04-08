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
                    Today's statistics
                </v-chip>
                <v-card
                    outlined
                    elevation="1"
                    align="center"
                >
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="overline mb-4">Total</div>
                            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-4">Employee</div>
                            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-4">Visitor</div>
                            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-content>
                            <div class="overline mb-4">Stranger</div>
                            <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
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
                        Devices
                    </v-chip>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <GChart
                                type="PieChart"
                                :data="chartData"
                                :options="devicesChartOptions"
                                style="width: 250px; height: 250px;"
                            />
                        </v-list-item-content>
                        <v-divider vertical class="mr-4"></v-divider>
                        
                        <v-list-item-content>
                            <div class="devicecondition">Subheader</div>
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
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item.on"></v-list-item-title>
                                            </v-list-item-content>
                                             <v-list-item-content>
                                                <v-list-item-title v-text="item.off"></v-list-item-title>
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
                        Daily check-in
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
                        Daily access control alarm
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
                        Yesterday Attendance
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
export default {
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    components: {
        GChart
    },
    data () {
      return {
        picker: new Date().toISOString().substr(0, 10),
        dates:[],
        nowSelected:"week",
        dayMenu: false,
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
            title : "Total Statistics",
            legend :'none',
            pieSliceText:'label',
            chartArea: {'width': '100%', 'height': '80%'},
            titleTextStyle: {
                fontSize: "13",
                bold: false,
                italic: false
            }
        },
        deviceConditionData : [
            { name : "DeviceA",on : 1, off : 8 },
            { name : "DeviceB",on : 2, off : 7 },
            { name : "DeviceC",on : 3, off : 6 },
            { name : "DeviceD",on : 4, off : 5 },
            { name : "DeviceE",on : 5, off : 4 },
            { name : "DeviceF",on : 6, off : 3 },
            { name : "DeviceG",on : 7, off : 2 },
            { name : "DeviceH",on : 8, off : 1 },
        ]
      }
    },
}
</script>

<style>
    .devicecondition{
        margin : 2.5px 0 0 0;
        text-anchor: start;
        font-family: Arial;
        font-size: 13px;
        stroke: none;
        stroke-width: 0;
        fill: rgb(0, 0, 0);
    }
</style>