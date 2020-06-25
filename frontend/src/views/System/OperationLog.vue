<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>
                    작업 기록
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
                        <v-btn text color="primary" @click="clickOK">확인</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-spacer></v-spacer>
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
                    :items="operation"
                    :page.sync="page"
                    :search="search"
                    item-key="_id"
                    @page-count="pageCount = $event"
                    hide-default-footer
                    class="ml-2 mr-2 elevation-0"
                ></v-data-table>
                <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios'
export default {
    methods:{
        clickOK () {
            if(this.dates.length === 1 || this.dates[0] === this.dates[1]) {
                this.operation = this.operationOrigin.filter(i=>i.date.split(' ')[0]=== this.dates[0])
            } else {
                if(this.dates[0] > this.dates[1]) {
                    let temp = this.dates[0]
                    this.dates[0] = this.dates[1];
                    this.dates[1] = temp;
                }
                this.operation = this.operationOrigin.filter(i => i.date.split(' ')[0] >= this.dates[0] && i.date.split(' ')[0] <= this.dates[1])
            }
            this.$refs.menu.save(this.dates)
        }
    },
    created() {
        axios.get('http://172.16.135.89:3000/operation')
            .then((res) => {
                this.operationOrigin = res.data;
                this.clickOK()
            })
    },
    computed: {
        dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    data() {
        return{
            operation:[],
            operationOrigin:[],
            itemsPerPage: 10,
            page: 1,
            search:'',
            pageCount: 0,
            deviceStates : [
                '모든 상태',
                '출석',
                '결석',
                '지각',
                '조퇴'
            ],
            dates: [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
            menu:false,
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    value: 'id.user_id',
                },
                { text: '날짜', value: 'date' ,filterable: false},
                { text: '행동', value: 'action'},
                { text: '상세', value: 'description'},
            ],
        }
    }
}
</script>