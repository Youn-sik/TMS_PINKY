<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
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
                        <v-date-picker v-model="dates" no-title scrollable range>
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
                    :items="accessRecord"
                    :items-per-page="5"
                    class="ml-2 mr-2 elevation-0"
                >
                    <template v-slot:item.avatar_file_url="{ item }">
                        <img 
                        width="70px"
                        class="mt-1 mb-1"
                        :src="item.avatar_file_url"/>
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
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios';
export default {
    data () {
        return {
            dates: [this.getFormatDate(new Date()), this.getFormatDate(new Date())],
            accessRecord : [],
            menu:false,
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
                { text: '', value: 'avatar_file_url' },
                {
                    text: '이름',
                    align: 'start',
                    value: 'user_obid',
                },
                { text: '온도', value: 'avatar_temperature' },
                { text: '출입시간', value: 'access_time' },
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
            this.accessRecord = res.data.filter((i) => {
                return(i.access_time >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1])
            })
            // = res.data.filter( function() {
            //     console.log(this.dates[0])
                // return i.access_time.split(' ')[0] >= this.dates[0] && i.access_time.split(' ')[0] <= this.dates[1]
            // })
            this.originData = res.data
            // console.log(this.accessRecord);
        })
    },
    methods: {
        clickOk () {
            this.$refs.menu.save(this.dates)
            // this.accessRecord = this.originData.filter( i => )
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
            return  year + '-' + month + '-' + day;
        }
    },
    watch: {
      nowStatus (val) {
        if(val.text === '모든 사용자') {
            this.accessRecord = this.originData
        } else {
            this.accessRecord = this.originData.filter(i => i.avatar_type === val.value)
        }
      },
    }
}
</script>