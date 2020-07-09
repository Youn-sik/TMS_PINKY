<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
                    출입 기록
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
                            style="width:5%"
                        ></v-text-field>
                        </template>
                        <v-date-picker v-model="dates" no-title scrollable locale="ko" range>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">취소</v-btn>
                        <v-btn text color="primary" @click="clickOk">확인</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-select
                        class="ml-5"
                        :items="deviceStates"
                        v-model="nowStatus"
                        :return-object="true"
                        style="width:5%"
                    ></v-select>
                    <v-select
                        class="ml-5"
                        :items="['전체','정상온도','온도이상자']"
                        v-model="tempStatus"
                        style="width:5%"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="검색"
                        single-line
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items-per-page="itemsPerPage"
                    :page.sync="page"
                    @page-count="pageCount = $event"
                    hide-default-footer
                    :items="accessRecord"
                    :search="search"
                    class="ml-2 mr-2 elevation-0"
                >
                    <template v-slot:no-data>
                        <div style="height:75vh; font-size:2em">
                            <v-row justify="center" align="center" style="height:100%;">
                                데이터가 없습니다
                            </v-row>
                        </div>
                    </template>
                    <template v-if="accessRecord.length > 0" v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.name">
                                <td v-if="item.avatar_temperature >= '38'" :class="'highTemp '+index+' image'" style="width:5%">
                                    <img 
                                    width="70px"
                                    class="mt-1 mb-1"
                                    :src="item.avatar_file_url"/>
                                </td>
                                <td v-else>
                                    <img 
                                    width="70px"
                                    style="margin-left:2px;"
                                    class="mt-1 mb-1"
                                    :src="item.avatar_file_url"/>
                                </td>

                                <td v-if="item.avatar_temperature >= '38'" :class="'highTemp '+index">
                                    <template v-if="item.avatar_type===1">사원</template>
                                    <template v-else-if="item.avatar_type===2">방문자</template>
                                    <template v-else-if="item.avatar_type===3">미등록자</template>
                                    <template v-else-if="item.avatar_type===4">블랙리스트</template>
                                </td>
                                <td v-else>
                                    <template v-if="item.avatar_type===1">사원</template>
                                    <template v-else-if="item.avatar_type===2">방문자</template>
                                    <template v-else-if="item.avatar_type===3">미등록자</template>
                                    <template v-else-if="item.avatar_type===4">블랙리스트</template>
                                </td>

                                <td v-if="item.avatar_temperature >= '38'" :class="'highTemp '+index">{{item.avatar_temperature.substring(0,4)}}</td>
                                <td v-else>{{item.avatar_temperature.substring(0,4)}}</td>

                                <td v-if="item.avatar_temperature >= '38'" :class="'highTemp '+index+' access'">{{item.access_time}}</td>
                                <td v-else>{{item.access_time}}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>
                <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios';
export default {
    data () {
        return {
            dates: [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
            accessRecord : [{}],
            accessRecordOrigin:[],
            itemsPerPage: 7,
            page: 1,
            pageCount: 0,
            menu:false,
            tempStatus:'전체',
            deviceStates : [
                {text:'모든 사용자',value:10},
                {text:'사원',value:1},
                {text:'방문자',value:2},
                {text:'블랙리스트',value:4},
                {text:'미등록자',value:3}
            ],
            search : null,
            nowStatus : {text:'모든 사용자',value:10},
            headers: [
                { text: '', value: 'avatar_file_url',filterable: false,size:'2em'},
                {
                    text: '타입',
                    align: 'start',
                    value: 'avatar_type',
                },
                { text: '온도', value: 'avatar_temperature'},
                { text: '출입시간', value: 'access_time',filterable: false},
            ],
        }
            
    },
    computed: {
        dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    created () {
        axios.get('http://172.16.135.89:3000/access').then((res) => {
            res.data = res.data.reverse();
            this.accessRecord = res.data.filter((i) => {
                return(i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1])
            })
            // = res.data.filter( function() {
            //     console.log(this.dates[0])
                // return i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1]
            // })
            this.originData = res.data
            this.accessRecordOrigin = this.accessRecord;
            // console.log(this.accessRecord);
        })
    },
    methods: {
        clickOk () {
            if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
                this.accessRecord = this.originData.filter( (i) =>{
                    return(i.access_time.split(' ')[0] === this.dates[0])
                } )
                this.nowStatus = {text:'모든 사용자',value:10}
                this.accessRecordOrigin = this.accessRecord;
            } else {
                if(this.dates[0] > this.dates[1]) {
                    let temp = this.dates[0];
                    this.dates[0] = this.dates[1]
                    this.dates[1] = temp;
                }
                this.accessRecord = this.originData.filter( (i) =>{
                    return(i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1])
                } )
                this.nowStatus = {text:'모든 사용자',value:10}
                this.accessRecordOrigin = this.accessRecord;
            }
            this.$refs.menu.save(this.dates)
        },
    },
    watch: {
      nowStatus (val) {
        this.tempStatus = '전체'
        if(val.text === '모든 사용자') {
            this.accessRecord = this.accessRecordOrigin
        } else {
            this.accessRecord = this.accessRecordOrigin.filter(i => i.avatar_type === val.value)
        }
      },
      tempStatus (val) {
        if(this.nowStatus.value === 10) {
            if(val === '전체') {
            this.accessRecord = this.accessRecordOrigin
            } else if(val === '온도이상자') {
                this.accessRecord = this.accessRecordOrigin.filter(i => i.avatar_temperature >= '38');
            } else {
                this.accessRecord = this.accessRecordOrigin.filter(i => i.avatar_temperature < '38')
            }
        } else {
            if(val === '전체') {
            this.accessRecord = this.accessRecordOrigin.filter(i => i.avatar_type === this.nowStatus.value)
            } else if(val === '온도이상자') {
                this.accessRecord = this.accessRecordOrigin.filter(i => i.avatar_type === this.nowStatus.value && i.avatar_temperature >= '38');
            } else {
                this.accessRecord = this.accessRecordOrigin.filter(i => i.avatar_type === this.nowStatus.value && i.avatar_temperature < '38')
            }
        }
      }
    }
}
</script>

<style>
    table {
        border:none;
        border-collapse: collapse;
    }
    .highTemp {
        background : rgba(255, 204, 204, 0.575); color:red;
    }
    .image {
        border-left : 3px solid red;
        padding-left: 0px;
        box-sizing: border-box;
    }
    .v-data-table td{
        font-size: 1em;
    }
    .v-data-table th{
        font-size: 0.8em;
    }
</style>