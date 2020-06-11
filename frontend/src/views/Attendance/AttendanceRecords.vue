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
                        <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-select
                        class="ml-5"
                        :items="deviceStates"
                        v-model="nowStatus"
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
    computed: {
        dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    created () {
        axios.get('http://172.16.135.89:3000/access').then((res) => {
            this.accessRecord = res.data
            console.log(this.accessRecord);
        })
    },
    data: () => ({
        accessRecord : [],
        deviceStates : [
            '모든 사용자',
            '사원',
            '방문자',
            '블랙리스트',
            '미등록자'
        ],
        nowStatus : '모든 사용자',
        dates: ['2019-09-10', '2019-09-20'],
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
    })
}
</script>